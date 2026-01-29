# syntax=docker/dockerfile:1.4
# Multi-stage build for C++ Signal Core

# Stage 1: Build
FROM gcc:13 AS builder

# Install dependencies including ccache for faster compilation
RUN apt-get update && apt-get install -y \
    cmake \
    libhiredis-dev \
    ccache \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Copy CMakeLists.txt first for better caching
COPY CMakeLists.txt .
COPY include ./include

# Copy source and tests
COPY src ./src
COPY tests ./tests

# Build with CMake cache mount and ccache
# This dramatically speeds up recompilation
RUN --mount=type=cache,target=/root/.ccache \
    mkdir build && cd build && \
    export PATH="/usr/lib/ccache:$PATH" && \
    cmake -DCMAKE_BUILD_TYPE=Release -DCMAKE_CXX_COMPILER_LAUNCHER=ccache .. && \
    make -j$(nproc)

# Stage 2: Runtime - use gcc:13-slim to get compatible libraries
FROM gcc:13

# Install runtime dependencies
RUN apt-get update && apt-get install -y \
    libhiredis0.14 \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Copy binary from builder
COPY --from=builder /app/build/signal_core .

# Expose any necessary ports (if needed)
# EXPOSE 8082

# Run the signal processor
ENTRYPOINT ["./signal_core"]
