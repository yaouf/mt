# Docker Setup for BDH Mobile App Development

This guide explains how to use Docker to run the BDH Mobile App frontend with Expo.

## Prerequisites

- [Docker](https://docs.docker.com/get-docker/)
- [Docker Compose](https://docs.docker.com/compose/install/)

## Getting Started

1. Build and start the container:

```bash
docker-compose up
```

This will:
- Build the Docker image (first time only)
- Start the Expo development server
- Map all necessary ports to your local machine

2. Access Expo:

- Web interface: http://localhost:19002
- Scan the QR code with Expo Go app on your phone
- Use iOS simulator or Android emulator from your local machine

## When to Run `docker-compose build`

Run `docker-compose build` when:
- You make changes to the Dockerfile
- You update dependencies in package.json
- You want to rebuild the image from scratch

For regular development after initial setup, you typically only need to run `docker-compose up`.

## Stopping the Container

To stop the container, press `Ctrl+C` in the terminal or run:

```bash
docker-compose down
```

## Troubleshooting

### QR Code Connection Issues

If you're having trouble connecting your device with the QR code:

1. Make sure your phone and computer are on the same WiFi network
2. Try manually entering the connection URL in the Expo Go app

### Port Conflicts

If you see port conflict errors, check if any other services are using these ports:
- 19000 (Expo)
- 19001 (Expo)
- 19002 (Expo DevTools)
- 8081 (React Native Packager)

### Slow Performance

If the app is running slowly in the container, consider running Expo directly on your host machine instead.

### Build Issues

If you encounter build errors:
- Check the Docker logs for specific error messages
- Try rebuilding with `docker-compose build --no-cache` to start fresh
- Verify your Dockerfile has the correct dependencies