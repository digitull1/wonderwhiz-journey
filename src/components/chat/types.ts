export interface Message {
  id: string;
  text: string;
  isUser: boolean;
  suggestions?: string[];
  image?: string;
}