# Scripts

This directory contains utility scripts for the portfolio website.

## sync-resumes.ts

A Node.js script that syncs resume files from Supabase storage, analyzes them using Grok AI, and stores the results in the database.

### Features

- Connects to Supabase storage bucket named `resumes`
- Downloads and analyzes resume files (PDF, DOCX, TXT)
- Uses Grok AI to extract structured information from resumes
- Creates entries in both `resumes` and `document_analyses` tables
- Creates related `chat_conversations` entries
- Extracts tags and metadata from analysis results
- Skips files that have already been processed

### Prerequisites

1. **Supabase Setup**: Ensure you have a `resumes` storage bucket in your Supabase project
2. **Database Tables**: Run the SQL migration to create the `resumes` table:
   ```sql
   -- Run the contents of create-resumes-table.sql in your Supabase SQL editor
   ```
3. **Environment Variables**: Make sure these are set in your `.env.local`:
   ```
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

### Usage

```bash
# Run the script
npm run sync-resumes

# Or directly with tsx
npx tsx scripts/sync-resumes.ts
```

### What it does

1. **Lists files** in the `resumes` storage bucket
2. **Checks for duplicates** by filename in the `resumes` table
3. **Downloads files** that haven't been processed yet
4. **Analyzes content** using Grok AI with the same prompt as the upload endpoint
5. **Creates database records**:
   - `resumes` table: filename, URL, analysis, metadata
   - `chat_conversations` table: new conversation for the resume
   - `document_analyses` table: links to conversation with full analysis
6. **Extracts tags** from the analysis (skills, experience level, primary field)

### File Format Support

Currently supports:
- ✅ **TXT files**: Full text extraction and analysis
- ⚠️ **PDF files**: Currently skipped (needs PDF parsing library)
- ⚠️ **DOCX files**: Currently skipped (needs DOCX parsing library)

### Output

The script provides detailed logging:
```
Starting resume sync...
Listing files in resumes bucket...
Found 3 files in resumes bucket
Processing file: john_doe_resume.txt
Analyzing resume: john_doe_resume.txt
Successfully processed john_doe_resume.txt
  - Resume ID: 123e4567-e89b-12d3-a456-426614174000
  - Conversation ID: 987fcdeb-51a2-43d1-b789-123456789abc
  - Document Analysis ID: 456def12-3456-7890-abcd-ef1234567890
  - Tags: software development, senior, JavaScript, React, Node.js
```

### Error Handling

- Gracefully handles file download errors
- Continues processing other files if one fails
- Provides detailed error messages for debugging
- Skips unsupported file types with warnings

### Customization

You can modify the script to:
- Add support for PDF/DOCX parsing by installing libraries like `pdf-parse` and `mammoth`
- Change the AI analysis prompt
- Modify the tag extraction logic
- Add additional metadata fields
- Implement batch processing for large numbers of files 