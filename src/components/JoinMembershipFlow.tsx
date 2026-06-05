import { useState } from 'react';
import { Link, useParams } from 'wouter';
import { CheckCircle2, Dumbbell, Wallet } from 'lucide-react';
import { toast } from 'sonner';
import { PublicLayout } from '../layouts/PublicLayout';
import { useAtlasStore } from '../state/AtlasStore';

const plans = [
  { name: 'MMA mensual', amount: 35000 },
  { name: 'Boxeo mensual', amount: 28000 },
  { name: 'BJJ mensual', amount: 32000 },
];

const money = (value: number) => `₡${value.toLocaleString('es-CR')}`;

export function JoinMembershipFlow() {
  const { slug } = useParams();
  const { getTenant, addMembershipRequest } = useAtlasStore();
  const tenant = getTenant(slug);
  const [plan, setPlan] = useState(plans[0]);
  const [client, setClient] = useState('');
  const [phone, setPhone] = useState('');
  const [notes, setNotes] = useState('');
  const [sent, setSent] = useState(false);

  const