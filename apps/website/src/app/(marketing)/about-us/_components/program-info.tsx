"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Award,
  Calendar,
  CheckCircle,
  Clock,
  DollarSign,
  GraduationCap,
  Lightbulb,
  Target,
  Users,
} from "lucide-react";

const InfoCard = ({
  icon: Icon,
  title,
  children,
  delay,
}: {
  icon: any;
  title: any;
  children: any;
  delay: any;
}) => (
  <motion.div
    className="rounded-2xl border border-blue-100 bg-white p-5 shadow-lg transition-shadow duration-300 hover:shadow-xl"
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay }}
    whileHover={{ scale: 1.03 }}
  >
    <motion.div
      className="mb-3 flex items-center"
      initial={{ x: -20 }}
      animate={{ x: 0 }}
      transition={{ duration: 0.3, delay: delay + 0.2 }}
    >
      <Icon className="mr-2 h-6 w-6 text-primary" />
      <h3 className="text-lg font-semibold text-blue-700">{title}</h3>
    </motion.div>
    <motion.div
      className="space-y-2 text-gray-600"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5, delay: delay + 0.4 }}
    >
      {children}
    </motion.div>
  </motion.div>
);

export default function ProgramInfo() {
  return (
    <div className="mx-auto rounded-3xl bg-gradient-to-br from-primary/10 to-primary/20 p-6 shadow-xl">
      <motion.h2
        className="mb-6 text-center text-5xl font-bold text-primary"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        Our Program at a Glance
      </motion.h2>

      <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
        <InfoCard icon={Calendar} title="Program Duration" delay={0.1}>
          <p className="flex items-center">
            <CheckCircle className="mr-2 h-4 w-4 text-primary" />
            Teams meet remotely once a week
          </p>
          <p className="flex items-center">
            <CheckCircle className="mr-2 h-4 w-4 text-primary" />
            Program runs for 3-4 months
          </p>
        </InfoCard>

        <InfoCard icon={Clock} title="Meeting Structure" delay={0.2}>
          <p className="flex items-center">
            <CheckCircle className="mr-2 h-4 w-4 text-primary" />
            Meetings typically last one hour
          </p>
          <p className="flex items-center">
            <CheckCircle className="mr-2 h-4 w-4 text-primary" />
            Flexible format based on team and project stage
          </p>
        </InfoCard>

        <InfoCard icon={Users} title="Meeting Content" delay={0.3}>
          <p>Coaches lead various activities including:</p>
          <ul className="mt-2 grid grid-cols-2 gap-2">
            <li className="flex items-center">
              <Target className="mr-2 h-4 w-4 text-primary" />
              Planning tasks
            </li>
            <li className="flex items-center">
              <Target className="mr-2 h-4 w-4 text-primary" />
              Status checks
            </li>
            <li className="flex items-center">
              <Target className="mr-2 h-4 w-4 text-primary" />
              Feedback
            </li>
            <li className="flex items-center">
              <Target className="mr-2 h-4 w-4 text-primary" />
              Brainstorming
            </li>
            <li className="flex items-center">
              <Target className="mr-2 h-4 w-4 text-primary" />
              Issue learning
            </li>
            <li className="flex items-center">
              <Target className="mr-2 h-4 w-4 text-primary" />
              Platform use
            </li>
            <li className="flex items-center">
              <Target className="mr-2 h-4 w-4 text-primary" />
              Guest speakers
            </li>
            <li className="flex items-center">
              <Target className="mr-2 h-4 w-4 text-primary" />
              Team building
            </li>
          </ul>
        </InfoCard>

        <InfoCard icon={DollarSign} title="Membership and Fees" delay={0.4}>
          <p className="flex items-center">
            <Award className="mr-2 h-4 w-4 text-yellow-500" />
            Yearly fee: $150 (includes four cohorts)
          </p>
          <p className="flex items-center">
            <Award className="mr-2 h-4 w-4 text-yellow-500" />
            Scholarships available for students in need
          </p>
          <p className="flex items-center">
            <Award className="mr-2 h-4 w-4 text-yellow-500" />
            Goal: Eliminate fees with sufficient funding
          </p>
        </InfoCard>

        <InfoCard icon={GraduationCap} title="Our Vision" delay={0.5}>
          <p className="flex items-center">
            <CheckCircle className="mr-2 h-4 w-4 text-green-500" />
            Empower high school students to make real impact
          </p>
          <p className="flex items-center">
            <CheckCircle className="mr-2 h-4 w-4 text-green-500" />
            Expand to college students and professionals by 2025
          </p>
        </InfoCard>

        <InfoCard icon={Lightbulb} title="Why Choose Us" delay={0.6}>
          <p className="flex items-center">
            <CheckCircle className="mr-2 h-4 w-4 text-green-500" />
            Hands-on experience in real-world projects
          </p>
          <p className="flex items-center">
            <CheckCircle className="mr-2 h-4 w-4 text-green-500" />
            Mentorship from experienced professionals
          </p>
          <p className="flex items-center">
            <CheckCircle className="mr-2 h-4 w-4 text-green-500" />
            Develop leadership and teamwork skills
          </p>
        </InfoCard>
      </div>

      <motion.div
        className="mt-6 text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.7, duration: 0.5 }}
      >
        <Link
          href="/apply"
          className="inline-flex items-center rounded-full border border-transparent bg-primary px-6 py-3 text-lg font-medium text-white shadow-sm transition-all duration-200 hover:scale-105 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Apply Now <ArrowRight className="ml-2 h-5 w-5" />
        </Link>
      </motion.div>
    </div>
  );
}
