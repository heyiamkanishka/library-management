FROM eclipse-temurin:17-jre

WORKDIR /app

# Copy all JARs and remove the plain one, keep the main one
COPY build/libs/*.jar ./
RUN rm *-plain.jar && mv *.jar app.jar

EXPOSE 8080

ENTRYPOINT ["java", "-jar", "app.jar"]