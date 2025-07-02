#!/bin/bash

# Prompt for a commit message
read -p "Enter commit message: " msg

git add .
git commit -m "$msg"
npm version patch
npm publish --access public
git push origin main --follow-tags

echo "\nRelease complete!" 