const db = require('../lib/prisma').default;
const bcrypt = require('bcryptjs');

async function main() {
    // Clear all previous data
    await db.achievement.deleteMany({})
    await db.typingStats.deleteMany({})
    await db.leaderboard.deleteMany({})
    await db.testimonial.deleteMany({})
    await db.user.deleteMany({})

    // Use a known password for all users
    const plainPassword = 'password123';
    const hashedPassword = await bcrypt.hash(plainPassword, 10);

    // New sample users with country codes (use create, not createMany)
    const userData = [
        {
            username: 'CyberNinja_X',
            email: 'cyberninja_x@example.com',
            passwordHash: hashedPassword,
            level: 47,
            country: 'JP',
            rank: 1,
        },
        {
            username: 'MatrixHacker',
            email: 'matrixhacker@example.com',
            passwordHash: hashedPassword,
            level: 45,
            country: 'US',
            rank: 2,
        },
        {
            username: 'QuantumTyper',
            email: 'quantumtyper@example.com',
            passwordHash: hashedPassword,
            level: 43,
            country: 'DE',
            rank: 3,
        },
        {
            username: 'NeonGhost',
            email: 'neonghost@example.com',
            passwordHash: hashedPassword,
            level: 41,
            country: 'KR',
            rank: 4,
        },
        {
            username: 'CodeBreaker',
            email: 'codebreaker@example.com',
            passwordHash: hashedPassword,
            level: 39,
            country: 'CA',
            rank: 5,
        },
        {
            username: 'DigitalSamurai',
            email: 'digitalsamurai@example.com',
            passwordHash: hashedPassword,
            level: 38,
            country: 'JP',
            rank: 6,
        },
        {
            username: 'ByteWarrior',
            email: 'bytewarrior@example.com',
            passwordHash: hashedPassword,
            level: 36,
            country: 'UK',
            rank: 7,
        },
        {
            username: 'HoloTypist',
            email: 'holotypist@example.com',
            passwordHash: hashedPassword,
            level: 35,
            country: 'AU',
            rank: 8,
        },
    ]
    // Explicitly type allUsers to avoid implicit any[] errors
    const allUsers: Array<{ id: string }> = []
    for (const data of userData) {
        const user = await db.user.create({ data })
        allUsers.push(user)
    }

    // Create leaderboard entries
    await db.leaderboard.createMany({
        data: [
            { userId: allUsers[0].id, wpm: 127, accuracy: 98.5, mode: 'time' },
            { userId: allUsers[1].id, wpm: 124, accuracy: 97.8, mode: 'time' },
            { userId: allUsers[2].id, wpm: 119, accuracy: 99.1, mode: 'time' },
            { userId: allUsers[3].id, wpm: 116, accuracy: 96.7, mode: 'time' },
            { userId: allUsers[4].id, wpm: 113, accuracy: 98.2, mode: 'time' },
            { userId: allUsers[5].id, wpm: 111, accuracy: 97.4, mode: 'time' },
            { userId: allUsers[6].id, wpm: 108, accuracy: 96.9, mode: 'time' },
            { userId: allUsers[7].id, wpm: 105, accuracy: 98.7, mode: 'time' },
        ],
    })

    // Create typing stats for each user
    await Promise.all(
        allUsers.map((user, i) =>
            db.typingStats.create({
                data: {
                    userId: user.id,
                    wpm: 100 + i * 3,
                    accuracy: 95 + i * 0.5,
                    timeElapsed: 60,
                    wordsCompleted: 30 + i * 2,
                    mode: 'time',
                },
            })
        )
    )

    // Add a sample achievement for each user
    await Promise.all(
        allUsers.map((user, i) =>
            db.achievement.create({
                data: {
                    userId: user.id,
                    title: `Achievement ${i + 1}`,
                    description: `Unlocked achievement ${i + 1}`,
                    achievedAt: new Date(),
                    unlockedAt: new Date(),
                },
            })
        )
    )

    // Add 5 more achievements for the first user
    await Promise.all(
        Array.from({ length: 5 }).map((_, i) =>
            db.achievement.create({
                data: {
                    userId: allUsers[0].id,
                    title: `Extra Achievement ${i + 1}`,
                    description: `Unlocked extra achievement ${i + 1}`,
                    achievedAt: new Date(),
                    unlockedAt: new Date(),
                },
            })
        )
    )

    // Add 5 more typing stats for the first user
    await Promise.all(
        Array.from({ length: 5 }).map((_, i) =>
            db.typingStats.create({
                data: {
                    userId: allUsers[0].id,
                    wpm: 110 + i * 2,
                    accuracy: 97 + i * 0.3,
                    timeElapsed: 60 + i * 5,
                    wordsCompleted: 35 + i * 3,
                    mode: 'time',
                },
            })
        )
    )
}

main()
    .catch((e) => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await db.$disconnect()
    })
