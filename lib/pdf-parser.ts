import { GoogleGenerativeAI } from "@google/generative-ai"
import { s3Service } from "./aws-s3"

// Mock NCERT content for development/fallback
const mockNCERTContent = {
  biology: {
    "cell-division": `
# Cell Cycle and Cell Division - NCERT Biology Class 11 Chapter 10

## Introduction
Cell division is a fundamental process in all living organisms. It is the process by which a parent cell divides into two or more daughter cells.

## Cell Cycle
The cell cycle is a series of events that take place in a cell leading to its division and the production of two daughter cells.

### Phases of Cell Cycle:
1. **G1 Phase (Gap 1)**: Cell grows in size and synthesizes proteins
2. **S Phase (Synthesis)**: DNA replication occurs
3. **G2 Phase (Gap 2)**: Cell continues to grow and prepares for division
4. **M Phase (Mitosis)**: Nuclear division occurs

## Mitosis
Mitosis is the process of nuclear division that results in two genetically identical diploid cells.

### Phases of Mitosis:
1. **Prophase**: Chromosomes condense and become visible, nuclear envelope breaks down
2. **Metaphase**: Chromosomes align at the equatorial plane (metaphase plate)
3. **Anaphase**: Sister chromatids separate and move to opposite poles
4. **Telophase**: Nuclear envelopes reform around each set of chromosomes

## Cytokinesis
The division of cytoplasm that follows nuclear division.

## Meiosis
Meiosis is a type of cell division that reduces chromosome number by half, producing four haploid gametes.

### Key Features:
- Crossing over occurs in Prophase I
- Two consecutive divisions (Meiosis I and II)
- Results in genetic variation
- Essential for sexual reproduction

## Cell Organelles
- **Mitochondria**: Powerhouse of the cell, produces ATP
- **Nucleus**: Controls cell activities, contains DNA
- **Ribosomes**: Protein synthesis
- **Endoplasmic Reticulum**: Transport system
- **Golgi Apparatus**: Processing and packaging

## Important Concepts for NEET:
- Chromosome structure and behavior
- Cell cycle checkpoints
- Differences between mitosis and meiosis
- Cytokinesis in plants vs animals
- Cell organelle functions
`,
    "cell-structure": `
# Cell Structure and Organization - NCERT Biology Class 11 Chapter 8

## Cell Theory
1. All living organisms are composed of cells
2. Cell is the basic unit of life
3. All cells arise from pre-existing cells

## Types of Cells
### Prokaryotic Cells
- No membrane-bound nucleus
- Genetic material freely distributed
- Examples: Bacteria, Blue-green algae

### Eukaryotic Cells
- Membrane-bound nucleus
- Organized genetic material
- Examples: Plant and animal cells

## Cell Organelles

### Nucleus
- Control center of the cell
- Contains DNA and nucleolus
- Nuclear envelope with pores

### Mitochondria
- Powerhouse of the cell
- Double membrane structure
- Site of cellular respiration

### Endoplasmic Reticulum (ER)
- **Rough ER**: Has ribosomes, protein synthesis
- **Smooth ER**: No ribosomes, lipid synthesis

### Golgi Apparatus
- Processing and packaging center
- Modifies proteins from ER

### Ribosomes
- Protein synthesis
- Free or attached to ER

### Lysosomes
- Digestive organelles
- Contain digestive enzymes

### Vacuoles
- Storage organelles
- Large in plant cells

### Cell Wall (Plants)
- Structural support
- Made of cellulose

### Chloroplasts (Plants)
- Site of photosynthesis
- Contains chlorophyll
`,
  },
  physics: {
    kinematics: `
# Kinematics - NCERT Physics Class 11 Chapter 3

## Motion in a Straight Line

### Basic Concepts
- **Position**: Location of an object
- **Displacement**: Change in position
- **Distance**: Total path length
- **Velocity**: Rate of change of displacement
- **Speed**: Rate of change of distance
- **Acceleration**: Rate of change of velocity

### Equations of Motion
For uniformly accelerated motion:
1. v = u + at
2. s = ut + ½at²
3. v² = u² + 2as

Where:
- u = initial velocity
- v = final velocity
- a = acceleration
- t = time
- s = displacement

### Types of Motion
1. **Uniform Motion**: Constant velocity
2. **Non-uniform Motion**: Variable velocity
3. **Uniformly Accelerated Motion**: Constant acceleration

### Graphical Analysis
- **Position-Time Graph**: Slope gives velocity
- **Velocity-Time Graph**: Slope gives acceleration, area gives displacement
- **Acceleration-Time Graph**: Area gives change in velocity

### Free Fall
- Motion under gravity
- g = 9.8 m/s² (acceleration due to gravity)
- Independent of mass of object
`,
  },
  chemistry: {
    "atomic-structure": `
# Atomic Structure - NCERT Chemistry Class 11 Chapter 2

## Discovery of Subatomic Particles

### Electron
- Discovered by J.J. Thomson
- Charge: -1.6 × 10⁻¹⁹ C
- Mass: 9.1 × 10⁻³¹ kg

### Proton
- Discovered by Goldstein
- Charge: +1.6 × 10⁻¹⁹ C
- Mass: 1.67 × 10⁻²⁷ kg

### Neutron
- Discovered by Chadwick
- No charge (neutral)
- Mass: 1.67 × 10⁻²⁷ kg

## Atomic Models

### Thomson's Model
- Plum pudding model
- Electrons embedded in positive sphere

### Rutherford's Model
- Nuclear model
- Dense positive nucleus
- Electrons revolve around nucleus

### Bohr's Model
- Electrons in fixed orbits
- Quantized energy levels
- Energy = -13.6/n² eV for hydrogen

## Electronic Configuration
- **Aufbau Principle**: Electrons fill lower energy orbitals first
- **Pauli Exclusion Principle**: Maximum 2 electrons per orbital
- **Hund's Rule**: Electrons occupy orbitals singly before pairing

### Orbital Types
- s orbital: spherical (max 2 electrons)
- p orbital: dumbbell shaped (max 6 electrons)
- d orbital: complex shapes (max 10 electrons)
- f orbital: very complex (max 14 electrons)

## Quantum Numbers
1. **Principal (n)**: Energy level
2. **Azimuthal (l)**: Orbital shape
3. **Magnetic (m)**: Orbital orientation
4. **Spin (s)**: Electron spin direction
`,
  },
}

export class PDFParserService {
  private genAI: GoogleGenerativeAI

  constructor() {
    this.genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!)
  }

  async parsePDFFromS3(subject: string, classLevel: string, chapter: string): Promise<string> {
    try {
      console.log(`Fetching PDF for ${subject} - ${classLevel} - ${chapter} from S3`)

      // Get PDF buffer from S3
      const pdfBuffer = await s3Service.getPDFBuffer(subject, classLevel, chapter)
      const base64Data = pdfBuffer.toString("base64")

      // Use Gemini to extract text from PDF
      const model = this.genAI.getGenerativeModel({ model: "gemini-1.5-pro" })

      const prompt = `Extract all text content from this NCERT PDF. Focus on:
      1. Main concepts and definitions
      2. Important facts and figures
      3. Diagrams descriptions
      4. Examples and case studies
      5. Key points and summaries
      \n      Provide clean, structured text that can be used for generating NEET-level MCQs.`

      const result = await model.generateContent([
        {
          inlineData: {
            data: base64Data,
            mimeType: "application/pdf",
          },
        },
        prompt,
      ])

      const response = await result.response
      return response.text()
    } catch (error) {
      console.error("Error parsing PDF from S3:", error)
      throw error
    }
  }

  async generateMCQsFromContent(
    content: string,
    subject: string,
    chapter: string,
    difficulty: "easy" | "medium" | "hard",
    count = 60,
  ) {
    try {
      const model = this.genAI.getGenerativeModel({ model: "gemini-1.5-pro" })

      const difficultyInstructions = {
        easy: "Direct recall questions from NCERT text. Test basic facts, definitions, and simple concepts.",
        medium:
          "Application-based questions requiring understanding and analysis of concepts. Include diagram-based questions.",
        hard: "Complex analytical questions requiring synthesis of multiple concepts. Include assertion-reasoning and case-study based questions.",
      }

      const prompt = `Generate exactly ${count} NEET-level multiple choice questions for ${subject} - ${chapter} at ${difficulty} difficulty.

NCERT Content:
${content}

Difficulty Level: ${difficulty}
Instructions: ${difficultyInstructions[difficulty]}

Requirements:
- Questions must be strictly based on the provided NCERT content
- Each question should have exactly 4 options (A, B, C, D)
- Only one correct answer per question
- Include detailed explanations with NCERT references
- Cover different topics within the chapter
- Questions should be suitable for NEET examination
- Avoid repetitive question patterns

Format as valid JSON array:
[
  {
    "question": "Question text here",
    "options": ["Option A", "Option B", "Option C", "Option D"],
    "correctAnswer": "Exact text of correct option",
    "explanation": "Detailed explanation with NCERT reference",
    "topic": "Specific topic within chapter",
    "difficulty": "${difficulty}"
  }
]

Generate exactly ${count} questions in this format.`

      const result = await model.generateContent(prompt)
      const response = await result.response
      const responseText = response.text()

      // Clean and parse JSON response
      const cleanedResponse = responseText.replace(/```json\n?|\n?```/g, "").trim()
      const questions = JSON.parse(cleanedResponse)

      if (!Array.isArray(questions) || questions.length !== count) {
        throw new Error(`Expected ${count} questions, got ${questions.length}`)
      }

      return questions
    } catch (error) {
      console.error("Error generating MCQs:", error)
      throw new Error("Failed to generate MCQs from content")
    }
  }

  // Fallback mock content (keeping existing implementation)
  async getMockContent(subject: string, chapter: string): Promise<string> {
    const subjectContent = mockNCERTContent[subject as keyof typeof mockNCERTContent]
    if (subjectContent && subjectContent[chapter as keyof typeof subjectContent]) {
      return subjectContent[chapter as keyof typeof subjectContent]
    }

    // Generic fallback content
    return `
# ${chapter.replace(/-/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())} - ${subject.toUpperCase()}

## Introduction
This chapter covers fundamental concepts in ${subject} related to ${chapter.replace(/-/g, " ")}.

## Key Topics
1. Basic definitions and concepts
2. Important principles and laws
3. Applications and examples
4. Problem-solving techniques

## Important Points for NEET
- Understand core concepts thoroughly
- Practice numerical problems
- Remember key formulas and definitions
- Focus on application-based questions

## Practice Questions
Regular practice with MCQs is essential for NEET preparation.
`
  }
}

export const pdfParserService = new PDFParserService()
