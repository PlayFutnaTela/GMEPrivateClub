import { Building2, LayoutDashboard, Briefcase, Users, MessageSquare, BarChart3 } from 'lucide-react';
import { NavLink } from '@/components/NavLink';

const navItems = [
  { title: 'Dashboard', url: '/dashboard', icon: LayoutDashboard },
  { title: 'Oportunidades', url: '/oportunidades', icon: Briefcase },
  { title: 'Contatos', url: '/contatos', icon: Users },
  { title: 'Pipeline', url: '/pipeline', icon: BarChart3 },
  { title: 'Concierge', url: '/concierge', icon: MessageSquare },
];

export const Sidebar = () => {
  return (
    <aside className="hidden md:flex w-64 bg-sidebar border-r border-sidebar-border flex-col">
      <div className="p-6 border-b border-sidebar-border">
        <div className="flex items-center gap-2 text-xl font-playfair font-semibold text-sidebar-foreground">
          <Building2 className="h-6 w-6 text-accent" />
          <span>GEREZIM</span>
        </div>
      </div>

      <nav className="flex-1 p-4 space-y-1">
        {navItems.map((item) => (
          <NavLink
            key={item.url}
            to={item.url}
            className="flex items-center gap-3 px-3 py-2 rounded-lg text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-colors"
            activeClassName="bg-sidebar-accent text-accent font-medium border-l-4 border-accent"
          >
            <item.icon className="h-5 w-5" />
            <span>{item.title}</span>
          </NavLink>
        ))}
      </nav>
    </aside>
  );
};
