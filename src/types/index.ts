
export interface GroceryItem {
  id: string;
  name: string;
  price: number;
  confidence?: number;
  category: string;
  image?: string;
}

export interface RecognitionResult {
  item: GroceryItem | null;
  confidence: number;
  success: boolean;
  message?: string;
}

export interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  type?: "primary" | "secondary" | "outline";
  disabled?: boolean;
  className?: string;
  icon?: React.ReactNode;
}
