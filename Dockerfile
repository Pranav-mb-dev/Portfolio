# Use a lightweight Nginx server to serve the static files
FROM nginx:alpine

# Copy the static website files to the Nginx document root
COPY . /usr/share/nginx/html

# Expose port 80
EXPOSE 80

# Start Nginx in the foreground
CMD ["nginx", "-g", "daemon off;"]
