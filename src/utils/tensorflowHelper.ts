
import * as tf from '@tensorflow/tfjs';
import { GroceryItem } from "../types";
import { groceryItems } from "../data/groceryItems";
import { toast } from "sonner";

// Color detection helper that replaces TensorFlow model
export class TensorflowHelper {
  private isLoaded: boolean = true;
  private isLoading: boolean = false;

  // We're not loading a model anymore, just detecting colors
  async loadModel(): Promise<boolean> {
    // Always return true since we're not using a model
    return true;
  }

  // Method to detect colors and recognize items based on color
  async recognizeImage(imageUri: string): Promise<{ item: GroceryItem, confidence: number }> {
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
      
      console.log("Image loaded, analyzing colors...");
      
      // Create a canvas to analyze the image
      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d');
      
      if (!context) {
        throw new Error('Could not get canvas context');
      }
      
      // Set canvas dimensions to match image
      canvas.width = img.width;
      canvas.height = img.height;
      
      // Draw image on canvas
      context.drawImage(img, 0, 0, img.width, img.height);
      
      // Get image data for color analysis
      const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
      const data = imageData.data;
      
      // Variables to count red and green pixels
      let redPixels = 0;
      let greenPixels = 0;
      
      // Analyze every pixel in the image
      for (let i = 0; i < data.length; i += 4) {
        const red = data[i];
        const green = data[i + 1];
        const blue = data[i + 2];
        
        // Detect red pixels (high red value, low green and blue)
        if (red > 150 && green < 100 && blue < 100) {
          redPixels++;
        }
        
        // Detect light green pixels (low red, high green, low blue)
        if (red < 100 && green > 150 && blue < 150) {
          greenPixels++;
        }
      }
      
      console.log(`Color analysis complete: Red pixels: ${redPixels}, Green pixels: ${greenPixels}`);
      
      // Determine which color is more prominent
      let item: GroceryItem;
      let confidence: number;
      
      if (redPixels > greenPixels) {
        // Return Red Lays
        item = this.getItemByName("Red Lays") || groceryItems[0];
        confidence = redPixels / (redPixels + greenPixels + 1);
        console.log("Detected red color, showing Red Lays");
      } else {
        // Return Greens Lays
        item = this.getItemByName("Greens Lays") || groceryItems[1];
        confidence = greenPixels / (redPixels + greenPixels + 1);
        console.log("Detected green color, showing Greens Lays");
      }
      
      return {
        item,
        confidence: Math.min(confidence, 0.99)
      };
    } catch (error) {
      console.error("Error during color detection:", error);
      return this.getFallbackResult();
    }
  }

  // Helper method to find an item by name
  private getItemByName(name: string): GroceryItem | undefined {
    return groceryItems.find(item => item.name === name || item.name.includes(name));
  }
  
  // Save the trained model - no longer needed but kept for API compatibility
  async saveModel(model: tf.LayersModel): Promise<boolean> {
    return true;
  }

  // Training function - no longer needed but kept for API compatibility
  async trainModelForTwoItems(): Promise<tf.LayersModel | null> {
    try {
      console.log("Color detection is now being used instead of model training");
      toast.info("Color detection is enabled. Point camera at red or green objects.");
      return null;
    } catch (error) {
      console.error("Error:", error);
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
