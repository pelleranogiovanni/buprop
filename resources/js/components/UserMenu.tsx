import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Link, router } from "@inertiajs/react"
import { User, Settings, LogOut, Heart, Plus } from "lucide-react"

interface UserMenuProps {
  user: {
    id: number
    name: string
    email: string
    avatar_url?: string
    roles?: Array<{ name: string }>
  }
}

export function UserMenu({ user }: UserMenuProps) {
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  const handleLogout = () => {
    router.post('/logout')
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-10 w-10 rounded-full">
          <Avatar className="h-10 w-10">
            <AvatarImage src={user.avatar_url} alt={user.name} />
            <AvatarFallback className="bg-primary text-primary-foreground">
              {getInitials(user.name)}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <div className="flex items-center justify-start gap-2 p-2">
          <div className="flex flex-col space-y-1 leading-none">
            <p className="font-medium">{user.name}</p>
            <p className="w-[200px] truncate text-sm text-muted-foreground">
              {user.email}
            </p>
          </div>
        </div>
        
        <DropdownMenuSeparator />
        
        <DropdownMenuItem asChild>
          <Link href="/perfil" className="cursor-pointer">
            <User className="mr-2 h-4 w-4" />
            Mi perfil
          </Link>
        </DropdownMenuItem>
        
        <DropdownMenuItem asChild>
          <Link href="/favoritos" className="cursor-pointer">
            <Heart className="mr-2 h-4 w-4" />
            Favoritos
          </Link>
        </DropdownMenuItem>
        
        {(user.roles?.some(role => ['owner', 'agency'].includes(role.name))) && (
          <DropdownMenuItem asChild>
            <Link href="/publicar" className="cursor-pointer">
              <Plus className="mr-2 h-4 w-4" />
              Publicar propiedad
            </Link>
          </DropdownMenuItem>
        )}
        
        <DropdownMenuItem asChild>
          <Link href="/configuracion" className="cursor-pointer">
            <Settings className="mr-2 h-4 w-4" />
            Configuración
          </Link>
        </DropdownMenuItem>
        
        <DropdownMenuSeparator />
        
        <DropdownMenuItem 
          className="cursor-pointer text-destructive focus:text-destructive"
          onClick={handleLogout}
        >
          <LogOut className="mr-2 h-4 w-4" />
          Cerrar sesión
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}