import { projects } from '@/data/projects';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import InteractiveProjectView from './InteractiveProjectView';

export function generateStaticParams() {
  return projects.map((project) => ({
    slug: project.slug,
  }));
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const project = projects.find(p => p.slug === params.slug);
  if (!project) return { title: 'Proyecto No Encontrado' };
  return { title: `${project.title} | Casos de Éxito Corporate` };
}

export default function ProjectPage({ params }: { params: { slug: string } }) {
  const project = projects.find(p => p.slug === params.slug);
  if (!project) return notFound();

  return <InteractiveProjectView project={project} />;
}
