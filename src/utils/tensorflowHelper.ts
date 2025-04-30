
import * as tf from '@tensorflow/tfjs';
import { GroceryItem } from "../types";
import { groceryItems } from "../data/groceryItems";
import { toast } from "sonner";

// TensorFlow Helper implementation for custom model
export class TensorflowHelper {
  private model: tf.LayersModel | null = null;
  private isLoaded: boolean = false;
  private isLoading: boolean = false;
  private classLabels: string[] = ['item1', 'item2']; // Your custom item classes

  // Load your custom trained model
  async loadModel(): Promise<boolean> {
    if (this.isLoaded) return true;
    if (this.isLoading) return false;

    try {
      this.isLoading = true;
      console.log("Loading custom TensorFlow model...");
      
      // Load the model from the finalData folder
      // Note: In production, you would host these files on a server
      // For development, we're assuming the files are in the public folder
      this.model = await tf.loadLayersModel('/finalData/model.json');
      
      console.log("Custom model loaded successfully!");
      this.isLoaded = true;
      this.isLoading = false;
      return true;
    } catch (error) {
      console.error("Error loading custom TensorFlow model:", error);
      this.isLoading = false;
      return false;
    }
  }

  // Method to recognize images with your custom model
  async recognizeImage(imageUri: string): Promise<{ item: GroceryItem, confidence: number }> {
    if (!this.isLoaded) {
      const loaded = await this.loadModel();
      if (!loaded) {
        console.log("Custom model not loaded, returning fallback result");
        return this.getFallbackResult();
      }
    }

    if (!this.model) {
      console.error("Model not loaded, returning fallback result");
      return this.getFallbackResult();
    }

    try {
      // Create an HTMLImageElement from the image URI
      const img = new Image();
      img.crossOrigin = 'anonymous';
      
      // Wait for the image to load
      await new Promise((resolve, reject) => {
        img.onload = resolve;
        img.onerror = (e) => {
          console.error("Image loading error:", e);
          reject(new Error("Failed to load image"));
        };
        img.src = imageUri;
      });
      
      console.log("Image loaded, running inference with custom model...");
      
      // Preprocess the image to match your custom model's input requirements
      // Adjust these parameters based on how you trained your model (likely 224x224 for MobileNet-based models)
      const tensor = tf.browser.fromPixels(img)
        .resizeBilinear([224, 224])
        .toFloat()
        .div(255.0)
        .expandDims();
      
      // Run inference
      const predictions = await this.model.predict(tensor) as tf.Tensor;
      const data = await predictions.data() as Float32Array;
      
      // Cleanup tensors
      tensor.dispose();
      predictions.dispose();
      
      console.log("Custom model inference complete:", data);
      
      // Find the class with highest probability
      const [maxProb, classId] = this.findMaxProbability(data);
      
      // Map to actual grocery item
      const matchingItem = this.mapClassIdToGroceryItem(classId);
      console.log("Matched to item:", matchingItem.name, "with confidence:", maxProb);
      
      return {
        item: matchingItem,
        confidence: maxProb
      };
    } catch (error) {
      console.error("Error recognizing image with custom model:", error);
      return this.getFallbackResult();
    }
  }

  // Find the highest probability class
  private findMaxProbability(predictions: Float32Array): [number, number] {
    let maxProb = -1;
    let classId = -1;
    
    for (let i = 0; i < predictions.length; i++) {
      if (predictions[i] > maxProb) {
        maxProb = predictions[i];
        classId = i;
      }
    }
    
    return [maxProb, classId];
  }
  
  // Map your custom model's class to a grocery item
  private mapClassIdToGroceryItem(classId: number): GroceryItem {
    // For a 2-class model, map each class to a specific grocery item
    // You'll want to update this mapping with your actual trained classes
    if (classId === 0) {
      return groceryItems[0]; // First class maps to first grocery item
    } else {
      return groceryItems[1]; // Second class maps to second grocery item
    }
  }
  
  // Save the trained model
  async saveModel(model: tf.LayersModel): Promise<boolean> {
    try {
      // Save to IndexedDB for browser storage
      await model.save('indexeddb://my-grocery-model');
      console.log('Model saved to IndexedDB');
      this.model = model;
      this.isLoaded = true;
      return true;
    } catch (error) {
      console.error('Error saving model:', error);
      return false;
    }
  }

  // Placeholder for training function
  async trainModelForTwoItems(): Promise<tf.LayersModel | null> {
    try {
      console.log("Starting model training for two items...");
      toast.info("Model training not yet implemented. Please follow the training steps.");
      return null;
    } catch (error) {
      console.error("Error training model:", error);
      return null;
    }
  }
  
  private getFallbackResult(): { item: GroceryItem, confidence: number } {
    // Return a fallback item with low confidence
    return {
      item: groceryItems[0],
      confidence: 0.3
    };
  }
}

// Export a singleton instance
export const tensorflowHelper = new TensorflowHelper();
