#!/bin/bash
# Sanity Setup Script
# Run this when you have access to your laptop

echo "Setting up Sanity CMS for Ezra Haugabrooks Portfolio..."

# Install Sanity CLI globally
npm install -g @sanity/cli

# Create new Sanity project
sanity init

# Follow the prompts:
# - Create new project
# - Project name: "ezra-haugabrooks-portfolio"
# - Use schema template: "Clean project with no predefined schemas"
# - Add sample data: No

echo "Sanity project created! Next steps:"
echo "1. cd into your sanity project directory"
echo "2. Copy the schema files from this project"
echo "3. Run 'sanity deploy' to deploy your studio"
echo "4. Update your environment variables"
