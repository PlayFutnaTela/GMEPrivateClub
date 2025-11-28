export type UserRole = 'user' | 'adm';

export interface Profile {
  id: string;
  full_name: string | null;
  bio: string | null;
  avatar_url: string | null;
  role: UserRole;
  updated_at: string;
}

export interface Product {
  id: string;
  title: string;
  subtitle: string | null;
  description: string | null;
  price: number;
  category: string | null;
  status: 'active' | 'inactive' | 'sold';
  images: string[];
  stock: number;
  commission_percent: number | null;
  created_at: string;
  updated_at: string;
}

export interface Opportunity {
  id: string;
  value: number;
  status: string;
  pipeline_stage: string;
  product_id: string | null;
  contact_id: string | null;
  created_at: string;
  updated_at: string;
}

export interface Contact {
  id: string;
  name: string;
  phone: string | null;
  email: string | null;
  status: 'quente' | 'morno' | 'frio';
  interests: string | null;
  source: string | null;
  created_at: string;
  updated_at: string;
}

export interface ConciergeConversation {
  id: string;
  user_id: string;
  status: string;
  last_message: string | null;
  folder_id: string | null;
  created_at: string;
  updated_at: string;
}

export interface ConciergeFolder {
  id: string;
  name: string;
  created_at: string;
}

export interface ConciergeSettings {
  id: string;
  key: string;
  value: string;
  created_at: string;
  updated_at: string;
}

export interface Favorite {
  id: string;
  user_id: string;
  product_id: string;
  created_at: string;
}

// Database schema type
export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: Profile;
        Insert: Omit<Profile, 'id' | 'updated_at'>;
        Update: Partial<Omit<Profile, 'id' | 'updated_at'>>;
      };
      products: {
        Row: Product;
        Insert: Omit<Product, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<Product, 'id' | 'created_at' | 'updated_at'>>;
      };
      opportunities: {
        Row: Opportunity;
        Insert: Omit<Opportunity, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<Opportunity, 'id' | 'created_at' | 'updated_at'>>;
      };
      contacts: {
        Row: Contact;
        Insert: Omit<Contact, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<Contact, 'id' | 'created_at' | 'updated_at'>>;
      };
      concierge_conversations: {
        Row: ConciergeConversation;
        Insert: Omit<ConciergeConversation, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<ConciergeConversation, 'id' | 'created_at' | 'updated_at'>>;
      };
      concierge_folders: {
        Row: ConciergeFolder;
        Insert: Omit<ConciergeFolder, 'id' | 'created_at'>;
        Update: Partial<Omit<ConciergeFolder, 'id' | 'created_at'>>;
      };
      concierge_settings: {
        Row: ConciergeSettings;
        Insert: Omit<ConciergeSettings, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<ConciergeSettings, 'id' | 'created_at' | 'updated_at'>>;
      };
      favorites: {
        Row: Favorite;
        Insert: Omit<Favorite, 'id' | 'created_at'>;
        Update: Partial<Omit<Favorite, 'id' | 'created_at'>>;
      };
    };
  };
}
