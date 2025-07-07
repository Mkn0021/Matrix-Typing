"use client"

import { motion, useInView } from "framer-motion"
import { Activity, Users, Zap, Trophy } from "lucide-react"
import { useRef, useState, useEffect } from "react"

const stats = [
	{
		icon: Users,
		value: 47293,
		label: "NEURAL_LINKS",
		suffix: "",
		description: "Active consciousness nodes in the network",
	},
	{
		icon: Activity,
		value: 2847392,
		label: "PROTOCOLS_EXECUTED",
		suffix: "",
		description: "Total reverse typing sequences processed",
	},
	{
		icon: Zap,
		value: 94.7,
		label: "EFFICIENCY_RATE",
		suffix: "%",
		description: "Average cognitive enhancement success rate",
	},
	{
		icon: Trophy,
		value: 340,
		label: "SPEED_MULTIPLIER",
		suffix: "%",
		description: "Maximum recorded performance boost",
	},
]

function AnimatedCounter({
	value,
	suffix = "",
}: {
	value: number
	suffix?: string
}) {
	const [count, setCount] = useState(0)
	const ref = useRef(null)
	const isInView = useInView(ref, { once: true })


	useEffect(() => {
		if (isInView) {
			let startTime: number | null = null;
			const end = value;
			const duration = 2000;

			const animate = (timestamp: number) => {
				if (startTime === null) startTime = timestamp;
				const progress = timestamp - startTime;
				const percentage = Math.min(progress / duration, 1);
				const currentValue = Math.floor(percentage * end);
				setCount(currentValue);

				if (progress < duration) {
					requestAnimationFrame(animate);
				} else {
					setCount(end); // ensure it ends exactly
				}
			};

			const rafId = requestAnimationFrame(animate);

			return () => cancelAnimationFrame(rafId);
		}
	}, [isInView, value]);


	return (
		<span ref={ref} className="font-mono">
			{count.toLocaleString()}
			{suffix}
		</span>
	)
}

export default function HologramStats() {
	const ref = useRef(null)
	const isInView = useInView(ref, { once: true, margin: "-100px" })
	const [particlePositions, setParticlePositions] = useState<
		{ left: number; top: number }[]
	>([])

	useEffect(() => {
		setParticlePositions(
			Array.from({ length: 20 }, () => ({
				left: Math.random() * 100,
				top: Math.random() * 100,
			}))
		)
	}, [])

	return (
		<section ref={ref} className="py-24 relative overflow-hidden">
			{/* Holographic grid */}
			<div className="absolute inset-0">
				<div
					className="absolute inset-0 opacity-30"
					style={{
						background: `
              radial-gradient(circle at 50% 50%, rgba(34,197,94,0.3) 1px, transparent 1px)
            `,
						backgroundSize: "30px 30px",
						animation: "pulse 4s ease-in-out infinite",
					}}
				/>
			</div>

			{/* Floating particles */}
			{particlePositions.map((pos, i) => (
				<motion.div
					key={i}
					className="absolute w-1 h-1 bg-green-400 rounded-full"
					style={{
						left: `${pos.left}%`,
						top: `${pos.top}%`,
					}}
					animate={{
						y: [0, -100, 0],
						opacity: [0, 1, 0],
						scale: [0, 1, 0],
					}}
					transition={{
						duration: Math.random() * 3 + 2,
						repeat: Number.POSITIVE_INFINITY,
						delay: Math.random() * 2,
					}}
				/>
			))}

			<div className="container mx-auto px-6 relative z-10">
				<motion.div
					initial={{ opacity: 0, y: 30 }}
					animate={isInView ? { opacity: 1, y: 0 } : {}}
					transition={{ duration: 0.8 }}
					className="text-center mb-16"
				>
					<div className="text-green-400 font-mono text-sm mb-4">
						{">"} NETWORK_STATUS
					</div>
					<h2 className="text-5xl md:text-6xl font-bold mb-6 text-white">
						GLOBAL
						<span className="text-green-400 drop-shadow-[0_0_20px_rgba(34,197,94,0.5)]">
							{" "}
							MATRIX
						</span>
					</h2>
					<div className="text-xl text-green-300 max-w-3xl mx-auto font-mono">
						Real-time statistics from the worldwide neural typing network
					</div>
				</motion.div>

				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
					{stats.map((stat, index) => (
						<motion.div
							key={stat.label}
							initial={{ opacity: 0, y: 50, rotateY: -15 }}
							animate={
								isInView ? { opacity: 1, y: 0, rotateY: 0 } : {}
							}
							transition={{ duration: 0.8, delay: index * 0.2 }}
							className="group relative"
							style={{ transformStyle: "preserve-3d" }}
						>
							<div className="bg-black/90 border border-green-500/50 rounded-lg p-6 text-center relative overflow-hidden backdrop-blur-sm group-hover:border-green-500 transition-all duration-300" style={{ aspectRatio: "1.167" }}>
								{/* Holographic effect */}
								<div className="absolute inset-0 bg-gradient-to-br from-green-500/10 via-transparent to-green-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

								{/* Scanning line */}
								<motion.div
									className="absolute left-0 right-0 h-px bg-green-500 opacity-0 group-hover:opacity-100"
									animate={{ y: [0, 100, 0] }}
									transition={{
										duration: 2,
										repeat: Number.POSITIVE_INFINITY,
									}}
								/>

								<div className="relative z-10">
									<div className="w-16 h-16 mx-auto mb-4 relative">
										<div className="w-full h-full bg-green-500/20 rounded-full flex items-center justify-center border border-green-500/50 group-hover:border-green-500 transition-colors">
											<stat.icon className="w-8 h-8 text-green-400" />
										</div>
										<div className="absolute inset-0 rounded-full border border-green-500/30 animate-ping" />
									</div>

									<div className="text-4xl font-bold mb-2 text-green-400">
										<AnimatedCounter
											value={stat.value}
											suffix={stat.suffix}
										/>
									</div>

									<div className="text-lg font-semibold mb-3 text-green-300 font-mono">
										{stat.label}
									</div>

									<p className="text-green-400/70 text-sm leading-relaxed">
										{stat.description}
									</p>

									{/* Status indicator */}
									<div className="mt-4 flex items-center justify-center gap-2">
										<div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
										<span className="text-green-400 text-xs font-mono">
											ONLINE
										</span>
									</div>
								</div>
							</div>
						</motion.div>
					))}
				</div>
			</div>
		</section>
	)
}
