import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Sidebar } from '@/components/dashboard/Sidebar';
import { Header } from '@/components/dashboard/Header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Briefcase, TrendingUp, DollarSign, Users } from 'lucide-react';

const Dashboard = () => {
  const { user, isLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading && !user) {
      navigate('/login');
    }
  }, [user, isLoading, navigate]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent"></div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const stats = [
    {
      title: 'Oportunidades Ativas',
      value: '24',
      icon: Briefcase,
      description: '+3 esta semana',
    },
    {
      title: 'Taxa de Conversão',
      value: '68%',
      icon: TrendingUp,
      description: '+5% desde último mês',
    },
    {
      title: 'Valor em Pipeline',
      value: 'R$ 2.4M',
      icon: DollarSign,
      description: '+12% desde último mês',
    },
    {
      title: 'Novos Contatos',
      value: '156',
      icon: Users,
      description: '+23 esta semana',
    },
  ];

  return (
    <div className="flex min-h-screen w-full">
      <Sidebar />

      <div className="flex-1 flex flex-col">
        <Header />

        <main className="flex-1 p-6 bg-muted/30">
          <div className="max-w-7xl mx-auto space-y-6">
            <div>
              <h1 className="text-3xl font-playfair font-bold mb-2">
                Olá, {user.name}! 👋
              </h1>
              <p className="text-muted-foreground">
                Aqui está um resumo do seu desempenho
              </p>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              {stats.map((stat) => (
                <Card key={stat.title} className="border-border/50 hover:border-accent/50 transition-colors">
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">
                      {stat.title}
                    </CardTitle>
                    <stat.icon className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold font-playfair">{stat.value}</div>
                    <p className="text-xs text-muted-foreground mt-1">
                      {stat.description}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>

            <Card className="border-border/50">
              <CardHeader>
                <CardTitle className="font-playfair">Atividades Recentes</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center gap-4 p-3 rounded-lg hover:bg-muted/50 transition-colors">
                    <div className="w-2 h-2 rounded-full bg-accent"></div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">Nova oportunidade criada</p>
                      <p className="text-xs text-muted-foreground">Empresa ABC - há 2 horas</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 p-3 rounded-lg hover:bg-muted/50 transition-colors">
                    <div className="w-2 h-2 rounded-full bg-accent"></div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">Reunião agendada</p>
                      <p className="text-xs text-muted-foreground">Cliente XYZ - há 4 horas</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 p-3 rounded-lg hover:bg-muted/50 transition-colors">
                    <div className="w-2 h-2 rounded-full bg-muted-foreground"></div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">Proposta enviada</p>
                      <p className="text-xs text-muted-foreground">Projeto Alpha - ontem</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
