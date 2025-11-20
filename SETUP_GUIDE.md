# Project Setup Guide

This guide will help you set up the project with your own credentials and API keys.

## Environment Variables

Create a `.env` file in the root directory of the project with the following variables:

```env
# Supabase Configuration
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_PUBLISHABLE_KEY=your_supabase_anon_key

# AI API Configuration
VITE_AI_API_KEY=your_ai_api_key

# Database Configuration
DATABASE_URL=your_database_connection_string

# Storage Configuration
STORAGE_BUCKET=your_storage_bucket_name

# Optional: Enable features
VITE_ENABLE_VOICE=true
VITE_ENABLE_INTERNET_SEARCH=true
VITE_ENABLE_MULTI_LANGUAGE=true
```

## Configuration Details

### 1. Supabase Setup

1. Create a Supabase account at https://supabase.com/
2. Create a new project
3. Get your Project URL and Anon Key from the project settings
4. Replace the placeholders in your `.env` file:
   - `VITE_SUPABASE_URL` with your project URL
   - `VITE_SUPABASE_PUBLISHABLE_KEY` with your anon key

### 2. Database Setup

1. Set up your PostgreSQL database
2. Update the `DATABASE_URL` in your `.env` file with your database connection string

### 3. AI API Setup

1. Choose an AI provider (OpenAI, Anthropic, etc.)
2. Get your API key from the provider
3. Replace `VITE_AI_API_KEY` in your `.env` file with your actual API key

### 4. Storage Setup

1. Set up your storage solution (AWS S3, Supabase Storage, etc.)
2. Create a bucket for file uploads
3. Update `STORAGE_BUCKET` in your `.env` file with your bucket name

## Installation

1. Install dependencies:
   ```bash
   npm install
   ```

2. Run the development server:
   ```bash
   npm run dev
   ```

## Building for Production

```bash
npm run build
```

The built files will be in the `dist/` directory.