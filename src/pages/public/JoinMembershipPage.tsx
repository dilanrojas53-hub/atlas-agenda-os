import { useState } from 'react';
import { Link, useParams } from 'wouter';
import { CheckCircle2, Dumbbell, UserRound, Wallet } from 'lucide-react';
import { toast } from 'sonner';
import { PublicLayout } from '../../layouts/PublicLayout';
import { useAtlasStore } from '../../state/AtlasStore';

const PLANS = [
  { name: 'MMA mensual', amount: 35000, note: 'Clases grupales y seguimiento base.' },
  { name: 'Boxeo mensual', amount: 28000, note: 'Técnica, condición y horarios flexibles.' },
  { name: 'BJJ mensual', amount: 32000, note: 'Fundamentos, sparring y progreso.' },
];

const money = (value: number) => `₡${value.toLocaleString('es-CR')}`;

export function JoinMembershipPage() {
  const { slug } = useParams();
  const { getTenant, addMembershipRequest } = useAtlasStore();
  const tenant = getTenant(slug);
  const [selected