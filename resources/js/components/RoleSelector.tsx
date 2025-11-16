import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Home, Building2, User } from "lucide-react"
import { cn } from "@/lib/utils"

interface RoleSelectorProps {
  selectedRole: string
  onRoleSelect: (role: string) => void
}

export function RoleSelector({ selectedRole, onRoleSelect }: RoleSelectorProps) {
  const roles = [
    {
      id: 'owner',
      title: 'Propietario',
      description: 'Tengo propiedades para alquilar o vender',
      icon: Home,
      color: 'bg-blue-50 border-blue-200 text-blue-700'
    },
    {
      id: 'agency',
      title: 'Inmobiliaria',
      description: 'Gestiono propiedades de terceros',
      icon: Building2,
      color: 'bg-green-50 border-green-200 text-green-700'
    },
    {
      id: 'tenant',
      title: 'Inquilino',
      description: 'Busco propiedades para alquilar',
      icon: User,
      color: 'bg-purple-50 border-purple-200 text-purple-700'
    }
  ]

  return (
    <div className="space-y-4">
      <div className="text-center">
        <h3 className="text-lg font-semibold mb-2">¿Cómo te vas a registrar?</h3>
        <p className="text-sm text-muted-foreground">
          Selecciona el tipo de cuenta que mejor se adapte a tus necesidades
        </p>
      </div>
      
      <div className="grid gap-3">
        {roles.map((role) => {
          const Icon = role.icon
          const isSelected = selectedRole === role.id
          
          return (
            <Card
              key={role.id}
              className={cn(
                "cursor-pointer transition-all duration-200 hover:shadow-md",
                isSelected 
                  ? "ring-2 ring-primary border-primary bg-primary/5" 
                  : "hover:border-gray-300"
              )}
              onClick={() => onRoleSelect(role.id)}
            >
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <div className={cn(
                    "p-2 rounded-lg",
                    isSelected ? "bg-primary text-primary-foreground" : role.color
                  )}>
                    <Icon className="w-5 h-5" />
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-semibold">{role.title}</h4>
                      {isSelected && (
                        <Badge variant="default" className="text-xs">
                          Seleccionado
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {role.description}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}