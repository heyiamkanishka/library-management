# Use Java 17 JRE (works perfectly on Apple Silicon Mac)
#FROM eclipse-temurin:17-jre

# Set working directory
#WORKDIR /app

# Copy the built JAR (Gradle puts it here)
#COPY build/libs/*.jar app.jar

# Expose port
#EXPOSE 8080

# Run the app
#ENTRYPOINT ["java", "-jar", "app.jar"]


FROM eclipse-temurin:17-jre

WORKDIR /app

# Copy the correct Spring Boot executable JAR
COPY build/libs/library-management-0.0.1-SNAPSHOT.jar app.jar

EXPOSE 8080

ENTRYPOINT ["java", "-jar", "app.jar"]