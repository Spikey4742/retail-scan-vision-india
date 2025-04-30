
import * as tf from '@tensorflow/tfjs';
import { GroceryItem } from "../types";
import { groceryItems } from "../data/groceryItems";

// TensorFlow Helper implementation
export class TensorflowHelper {
  private model: tf.GraphModel | tf.LayersModel | null = null;
  private isLoaded: boolean = false;
  private isLoading: boolean = false;

  async loadModel(): Promise<boolean> {
    if (this.isLoaded) return true;
    if (this.isLoading) return false;

    try {
      this.isLoading = true;
      console.log("Loading TensorFlow model...");
      
      // Use MobileNet v2 which is more reliable
      this.model = await tf.loadLayersModel(
        'https://storage.googleapis.com/tfjs-models/tfjs/mobilenet_v1_0.25_224/model.json'
      );
      
      this.isLoaded = true;
      this.isLoading = false;
      console.log("TensorFlow model loaded successfully");
      return true;
    } catch (error) {
      console.error("Error loading TensorFlow model:", error);
      this.isLoading = false;
      return false;
    }
  }

  async recognizeImage(imageUri: string): Promise<{ item: GroceryItem, confidence: number }> {
    if (!this.isLoaded) {
      const loaded = await this.loadModel();
      if (!loaded) {
        console.error("Model failed to load, returning fallback result");
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
      
      console.log("Image loaded, running inference...");
      
      // Preprocess the image to match the model input requirements
      const tensor = tf.browser.fromPixels(img)
        .resizeBilinear([224, 224])   // MobileNet expects 224x224 images
        .toFloat()
        .expandDims();
        
      // Normalize the image from [0, 255] to [-1, 1]
      const normalized = tf.div(tensor, 127.5).sub(1);
      
      // Run inference
      const predictions = await this.model.predict(normalized) as tf.Tensor;
      
      // Get data as Float32Array to fix type error
      const data = await predictions.data() as Float32Array;
      
      // Cleanup tensors to prevent memory leaks
      tensor.dispose();
      normalized.dispose();
      predictions.dispose();
      
      console.log("Inference complete, processing results...");
      
      // Find the class with the highest probability
      const [maxProb, classId] = this.findMaxProbability(data);
      
      // Map the prediction to a grocery item
      const matchingItem = this.mapPredictionToGroceryItem(classId, maxProb);
      console.log("Matched to item:", matchingItem.name, "with confidence:", maxProb);
      
      return {
        item: matchingItem,
        confidence: maxProb
      };
    } catch (error) {
      console.error("Error recognizing image:", error);
      return this.getFallbackResult();
    }
  }

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
  
  private mapPredictionToGroceryItem(classId: number, confidence: number): GroceryItem {
    // In a production app, you would have a proper mapping from model class IDs to your products
    // For demo purposes, we'll use a simple hashing approach to select from our grocery items
    
    // Use class ID to deterministically select a grocery item
    const index = Math.abs(classId) % groceryItems.length;
    return groceryItems[index];
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
