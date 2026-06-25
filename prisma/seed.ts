import { PrismaClient } from '@prisma/client'
import { Pool } from 'pg'
import { PrismaPg } from '@prisma/adapter-pg'
import 'dotenv/config'

const connectionString = process.env.DATABASE_URL
if (!connectionString) {
  throw new Error('DATABASE_URL is not defined')
}

const pool = new Pool({ connectionString })
const adapter = new PrismaPg(pool)
const prisma = new PrismaClient({ adapter })

async function main() {
  const exercises = [
    // Free Weights
    { name: 'Dumbbell Bench Press', category: 'Free Weights' },
    { name: 'Barbell Squat', category: 'Free Weights' },
    { name: 'Deadlift', category: 'Free Weights' },
    { name: 'Dumbbell Bicep Curl', category: 'Free Weights' },
    { name: 'Overhead Press', category: 'Free Weights' },
    { name: 'Dumbbell Row', category: 'Free Weights' },
    { name: 'Barbell Lunges', category: 'Free Weights' },
    { name: 'Dumbbell Lateral Raise', category: 'Free Weights' },
    { name: 'Hammer Curls', category: 'Free Weights' },
    { name: 'Skull Crushers', category: 'Free Weights' },

    // Weight Machines
    { name: 'Chest Press Machine', category: 'Weight Machines' },
    { name: 'Leg Press Machine', category: 'Weight Machines' },
    { name: 'Lat Pulldown Machine', category: 'Weight Machines' },
    { name: 'Leg Extension Machine', category: 'Weight Machines' },
    { name: 'Seated Cable Row', category: 'Weight Machines' },
    { name: 'Shoulder Press Machine', category: 'Weight Machines' },
    { name: 'Pec Deck Fly', category: 'Weight Machines' },
    { name: 'Cable Tricep Pushdown', category: 'Weight Machines' },
    { name: 'Machine Bicep Curl', category: 'Weight Machines' },
    { name: 'Hamstring Curl Machine', category: 'Weight Machines' },

    // Bodyweight
    { name: 'Push-ups', category: 'Bodyweight' },
    { name: 'Pull-ups', category: 'Bodyweight' },
    { name: 'Squats', category: 'Bodyweight' },
    { name: 'Plank', category: 'Bodyweight' },
    { name: 'Lunges', category: 'Bodyweight' },
    { name: 'Burpees', category: 'Bodyweight' },
    { name: 'Dips', category: 'Bodyweight' },
    { name: 'Leg Raises', category: 'Bodyweight' },
    { name: 'Mountain Climbers', category: 'Bodyweight' },
    { name: 'Crunches', category: 'Bodyweight' },
  ]

  console.log('Seeding exercises...')

  for (const exercise of exercises) {
    try {
        await prisma.exercise.create({
          data: exercise,
        })
        console.log(`- Created: ${exercise.name}`)
    } catch (e) {
        console.log(`- Skipped: ${exercise.name}`)
    }
  }

  console.log('Seeding finished.')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
