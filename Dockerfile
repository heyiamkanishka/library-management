# Use Java 17 JRE (works perfectly on Apple Silicon Mac)
FROM eclipse-temurin:17-jre

# Set working directory
WORKDIR /app

# Copy the built JAR (Gradle puts it here)
COPY build/libs/*.jar app.jar

# Expose port
EXPOSE 8080

# Run the app
ENTRYPOINT ["java", "-jar", "app.jar"]