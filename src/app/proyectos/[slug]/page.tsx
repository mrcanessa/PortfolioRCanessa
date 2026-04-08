import { projects } from '@/data/projects';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import InteractiveProjectView from './InteractiveProjectView';

export function generateStaticParams() {
  return projects.map((project) => ({
    slug: project.slug,
  }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const project = projects.find(p => p.slug === slug);
  if (!project) return { title: 'Proyecto No Encontrado' };
  return { title: `${project.title} | Casos de Éxito Corporate` };
}

export default async function ProjectPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = projects.find(p => p.slug === slug);
  if (!project) return notFound();

  return <InteractiveProjectView project={project} />;
}
