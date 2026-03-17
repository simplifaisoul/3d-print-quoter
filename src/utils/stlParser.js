/*
 * STL Parser — Client-side 3D file analysis
 * Calculates volume, bounding box, surface area, and triangle count
 * Uses the signed tetrahedron method for volume calculation
 */

/**
 * Parse an STL file (binary or ASCII) and return geometry data
 * @param {ArrayBuffer} buffer - The file contents as ArrayBuffer
 * @returns {Object} - { volume, boundingBox, surfaceArea, triangleCount, dimensions }
 */
export function parseSTL(buffer) {
    const isBinary = isSTLBinary(buffer)

    let triangles
    if (isBinary) {
        triangles = parseBinarySTL(buffer)
    } else {
        triangles = parseASCIISTL(buffer)
    }

    return analyzeGeometry(triangles)
}

/**
 * Check if STL file is binary or ASCII
 */
function isSTLBinary(buffer) {
    // Binary STL: 80 byte header + 4 byte triangle count + 50 bytes per triangle
    const view = new DataView(buffer)
    const expectedSize = 84 + view.getUint32(80, true) * 50

    // If the file size matches expected binary size, it's binary
    // Also check if it starts with "solid" to identify ASCII
    if (buffer.byteLength === expectedSize) return true

    const header = new Uint8Array(buffer, 0, 5)
    const headerStr = String.fromCharCode(...header)
    if (headerStr === 'solid') return false

    return true
}

/**
 * Parse binary STL format
 */
function parseBinarySTL(buffer) {
    const view = new DataView(buffer)
    const triangleCount = view.getUint32(80, true)
    const triangles = []

    let offset = 84
    for (let i = 0; i < triangleCount; i++) {
        // Skip normal (12 bytes)
        const normal = [
            view.getFloat32(offset, true),
            view.getFloat32(offset + 4, true),
            view.getFloat32(offset + 8, true),
        ]
        offset += 12

        // Read 3 vertices (each 12 bytes = 3 floats)
        const v1 = [
            view.getFloat32(offset, true),
            view.getFloat32(offset + 4, true),
            view.getFloat32(offset + 8, true),
        ]
        offset += 12

        const v2 = [
            view.getFloat32(offset, true),
            view.getFloat32(offset + 4, true),
            view.getFloat32(offset + 8, true),
        ]
        offset += 12

        const v3 = [
            view.getFloat32(offset, true),
            view.getFloat32(offset + 4, true),
            view.getFloat32(offset + 8, true),
        ]
        offset += 12

        // Skip attribute byte count (2 bytes)
        offset += 2

        triangles.push({ v1, v2, v3, normal })
    }

    return triangles
}

/**
 * Parse ASCII STL format
 */
function parseASCIISTL(buffer) {
    const text = new TextDecoder().decode(buffer)
    const triangles = []

    const facetRegex = /facet\s+normal\s+([\-\d.eE+]+)\s+([\-\d.eE+]+)\s+([\-\d.eE+]+)\s+outer\s+loop\s+vertex\s+([\-\d.eE+]+)\s+([\-\d.eE+]+)\s+([\-\d.eE+]+)\s+vertex\s+([\-\d.eE+]+)\s+([\-\d.eE+]+)\s+([\-\d.eE+]+)\s+vertex\s+([\-\d.eE+]+)\s+([\-\d.eE+]+)\s+([\-\d.eE+]+)\s+endloop\s+endfacet/gi

    let match
    while ((match = facetRegex.exec(text)) !== null) {
        triangles.push({
            normal: [parseFloat(match[1]), parseFloat(match[2]), parseFloat(match[3])],
            v1: [parseFloat(match[4]), parseFloat(match[5]), parseFloat(match[6])],
            v2: [parseFloat(match[7]), parseFloat(match[8]), parseFloat(match[9])],
            v3: [parseFloat(match[10]), parseFloat(match[11]), parseFloat(match[12])],
        })
    }

    return triangles
}

/**
 * Analyze geometry from triangles to get volume, dimensions, surface area
 */
function analyzeGeometry(triangles) {
    let volume = 0
    let surfaceArea = 0
    let minX = Infinity, minY = Infinity, minZ = Infinity
    let maxX = -Infinity, maxY = -Infinity, maxZ = -Infinity

    for (const tri of triangles) {
        const { v1, v2, v3 } = tri

        // Update bounding box
        for (const v of [v1, v2, v3]) {
            minX = Math.min(minX, v[0])
            minY = Math.min(minY, v[1])
            minZ = Math.min(minZ, v[2])
            maxX = Math.max(maxX, v[0])
            maxY = Math.max(maxY, v[1])
            maxZ = Math.max(maxZ, v[2])
        }

        // Signed volume of tetrahedron formed by triangle and origin
        // V = (1/6) * |v1 · (v2 × v3)|
        volume += signedTetrahedronVolume(v1, v2, v3)

        // Surface area: area of the triangle
        surfaceArea += triangleArea(v1, v2, v3)
    }

    // Volume is absolute (direction-independent for closed meshes)
    volume = Math.abs(volume)

    // Convert mm to cm for volume (mm³ → cm³, divide by 1000)
    const volumeCm3 = volume / 1000

    // Dimensions in mm
    const dimensions = {
        x: maxX - minX,
        y: maxY - minY,
        z: maxZ - minZ,
    }

    // Surface area in cm²
    const surfaceAreaCm2 = surfaceArea / 100

    return {
        volumeMm3: volume,
        volumeCm3,
        surfaceAreaMm2: surfaceArea,
        surfaceAreaCm2,
        triangleCount: triangles.length,
        dimensions, // in mm
        boundingBox: {
            min: { x: minX, y: minY, z: minZ },
            max: { x: maxX, y: maxY, z: maxZ },
        },
    }
}

/**
 * Signed volume of tetrahedron formed by triangle and origin
 * Uses the formula: V = (1/6) * (v1 · (v2 × v3))
 */
function signedTetrahedronVolume(v1, v2, v3) {
    return (
        (v1[0] * (v2[1] * v3[2] - v2[2] * v3[1]) +
            v1[1] * (v2[2] * v3[0] - v2[0] * v3[2]) +
            v1[2] * (v2[0] * v3[1] - v2[1] * v3[0])) / 6.0
    )
}

/**
 * Area of a triangle from 3 vertices
 */
function triangleArea(v1, v2, v3) {
    // Cross product of (v2 - v1) and (v3 - v1)
    const ax = v2[0] - v1[0], ay = v2[1] - v1[1], az = v2[2] - v1[2]
    const bx = v3[0] - v1[0], by = v3[1] - v1[1], bz = v3[2] - v1[2]

    const cx = ay * bz - az * by
    const cy = az * bx - ax * bz
    const cz = ax * by - ay * bx

    return 0.5 * Math.sqrt(cx * cx + cy * cy + cz * cz)
}

/**
 * Estimate print time for FDM based on volume and layer height
 * @param {number} volumeCm3 - Volume in cm³
 * @param {number} layerHeight - Layer height in mm (default 0.2)
 * @param {number} infillPercent - Infill percentage (0-100)
 * @returns {number} Estimated print time in hours
 */
export function estimateFDMPrintTime(volumeCm3, layerHeight = 0.2, infillPercent = 20, dimensions = null) {
    // Base print speed: ~40 mm/s average for FDM (accounting for accel/decel)
    // Extrusion width: ~0.4mm (standard nozzle)
    // Layer height affects # of layers

    // Effective volume considering infill (rough estimate)
    // Shell thickness is typically 2-3 walls (0.8-1.2mm)
    // Inner volume is infilled at the given percentage
    const shellFraction = 0.25 // ~25% of volume is shell
    const effectiveVolume = volumeCm3 * (shellFraction + (1 - shellFraction) * (infillPercent / 100))

    // Convert cm³ to mm³ for calculation
    const effectiveVolumeMm3 = effectiveVolume * 1000

    // Approximate flow rate: speed × layer_height × extrusion_width = mm³/s
    const printSpeed = 40 // mm/s
    const extrusionWidth = 0.4 // mm
    const flowRate = printSpeed * layerHeight * extrusionWidth // mm³/s

    // Print time = effective volume / flow rate
    let timeSeconds = effectiveVolumeMm3 / flowRate

    // Add travel time overhead (~30%)
    timeSeconds *= 1.3

    // Add time for layer changes, retractions, etc.
    if (dimensions) {
        const height = Math.max(dimensions.x, dimensions.y, dimensions.z)
        const numLayers = height / layerHeight
        timeSeconds += numLayers * 2 // ~2 seconds per layer for moves
    }

    // Add heating/setup time (5 minutes)
    timeSeconds += 300

    const timeHours = timeSeconds / 3600

    return Math.max(0.5, timeHours) // Minimum 30 minutes
}
