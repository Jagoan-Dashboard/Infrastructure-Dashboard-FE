'use client';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Home, Trash2, UserCog, ChevronLeft, ChevronRight, Search, Filter, Mail, UserCircle, Loader2, Edit } from "lucide-react";
import { Button } from "@/components/ui/button"; 
import { Input } from "@/components/ui/input"; 
import { useMemo, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { useUserManagement } from './hooks/useUser-management';
import { useUserManagementStore } from './store/user-management-store';
import { CreateUserModal } from './components/CreateUserModal';
import { ChangeRoleModal } from './components/ChangeRoleModal';
import { DeleteUserDialog } from './components/DeleteUserDialog';
import { User } from './types/user-management-types';

export default function UserManagementPage() {
  const router = useRouter();
  const { users, total, loading } = useUserManagement();
  const { setModalOpen } = useUserManagementStore();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<string | undefined>(undefined);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(8);
  
  const [selectedUserForRole, setSelectedUserForRole] = useState<User | null>(null);
  const [selectedUserForDelete, setSelectedUserForDelete] = useState<User | null>(null);

  // Permission check: redirect if user is not admin
  useEffect(() => {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      try {
        const user = JSON.parse(userStr);
        if (user.role !== 'SUPERADMIN') {
          router.push('/dashboard');
        }
      } catch (error) {
        console.error('Failed to parse user from localStorage:', error);
      }
    }
  }, [router]);

  const filtered = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    let arr = users;
    if (q) {
      arr = arr.filter((u) =>
        u.name.toLowerCase().includes(q) ||
        u.email.toLowerCase().includes(q)
      );
    }
    if (roleFilter && roleFilter !== 'all') {
      arr = arr.filter((u) => u.role === roleFilter);
    }
    return arr;
  }, [users, searchQuery, roleFilter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / rowsPerPage));
  const safePage = Math.min(currentPage, totalPages);
  const startIdx = (safePage - 1) * rowsPerPage;
  const pageItems = filtered.slice(startIdx, startIdx + rowsPerPage);

  const getRoleColor = (role: string) => {
    switch(role) {
      case 'SUPERADMIN': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'USER': return 'bg-blue-100 text-blue-700 border-blue-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getRoleLabel = (role: string) => {
    return role === 'SUPERADMIN' ? 'Super Admin' : 'User';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-gray-50 p-4 lg:p-8">
      <div className="container mx-auto max-w-7xl">
        <div className="space-y-6">
          {/* Breadcrumb */}
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/dashboard" className="flex items-center gap-1 hover:text-blue-600 transition-colors">
                  <Home className="w-4 h-4" />
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage className="text-gray-700 font-medium">User Management</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>

          {/* Header Section */}
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div>
              <p className="text-sm text-gray-600">Kabupaten Ngawi</p>
              <h1 className="text-xl lg:text-2xl font-bold text-blue-600">User Management</h1>
            </div>

            <Button 
              onClick={() => setModalOpen(true)}
              className="bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 shadow-lg shadow-blue-200 transition-all"
            >
              <UserCircle className="w-4 h-4 mr-2" />
              Tambah Pengguna
            </Button>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Card className="border-none shadow-sm hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Total Users</p>
                    <p className="text-2xl font-bold text-gray-900">{total}</p>
                  </div>
                  <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
                    <UserCircle className="w-6 h-6 text-blue-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="border-none shadow-sm hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Total Admin</p>
                    <p className="text-2xl font-bold text-green-600">
                      {users.filter(u => u.role === 'SUPERADMIN').length}
                    </p>
                  </div>
                  <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center">
                    <div className="h-3 w-3 rounded-full bg-green-500 animate-pulse" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-none shadow-sm hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Total User</p>
                    <p className="text-2xl font-bold text-blue-600">
                      {users.filter(u => u.role === 'USER').length}
                    </p>
                  </div>
                  <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
                    <UserCog className="w-6 h-6 text-blue-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Filters Section */}
          <Card className="border-none shadow-sm">
            <CardContent className="p-6">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    placeholder="Cari username atau email..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 border-gray-200 focus:border-blue-400 focus:ring-blue-400"
                  />
                </div>
                
                <Select onValueChange={(v) => { setRoleFilter(v); setCurrentPage(1); }}>
                  <SelectTrigger className="w-full sm:w-[200px] border-gray-200">
                    <Filter className="w-4 h-4 mr-2" />
                    <SelectValue placeholder="Filter peran" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Semua Peran</SelectItem>
                    <SelectItem value="SUPERADMIN">Super Admin</SelectItem>
                    <SelectItem value="USER">User</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Table Section */}
          <Card className="border-none shadow-lg overflow-hidden">
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                {loading ? (
                  <div className="flex items-center justify-center py-12">
                    <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
                    <p className="ml-3 text-gray-600">Memuat data...</p>
                  </div>
                ) : (
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-4 px-6 font-semibold text-gray-700 text-sm">Nama</th>
                        <th className="text-left py-4 px-6 font-semibold text-gray-700 text-sm">Email</th>
                        <th className="text-left py-4 px-6 font-semibold text-gray-700 text-sm">Role</th>
                        <th className="text-right py-4 px-6 font-semibold text-gray-700 text-sm">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {pageItems.length === 0 ? (
                        <tr>
                          <td colSpan={4} className="text-center py-12">
                            <div className="flex flex-col items-center gap-2">
                              <UserCircle className="w-12 h-12 text-gray-300" />
                              <p className="text-gray-500">Tidak ada data pengguna</p>
                            </div>
                          </td>
                        </tr>
                      ) : (
                        pageItems.map((u) => (
                          <tr key={u.id} className="border-b border-gray-50 hover:bg-blue-50/30 transition-colors">
                            <td className="py-4 px-6">
                              <div className="flex items-center gap-3">
                                <div>
                                  <p className="font-medium text-gray-900">{u.name}</p>
                                </div>
                              </div>
                            </td>
                            <td className="py-4 px-6">
                              <div className="flex items-center gap-2 text-gray-600">
                                <Mail className="w-4 h-4 text-gray-400" />
                                <span className="text-sm">{u.email}</span>
                              </div>
                            </td>
                            <td className="py-4 px-6">
                              <Badge className={`${getRoleColor(u.role)} border font-medium`}>
                                {getRoleLabel(u.role)}
                              </Badge>
                            </td>
                            <td className="py-4 px-6 text-right">
                              <div className="flex justify-end gap-2">
                                <Button 
                                  size="icon" 
                                  variant="ghost" 
                                  className="h-8 w-8 hover:bg-blue-50 hover:text-blue-600" 
                                  aria-label="Change Role"
                                  onClick={() => setSelectedUserForRole(u)}
                                >
                                  <UserCog className="h-4 w-4" />
                                </Button>
                                <Button 
                                  size="icon" 
                                  variant="ghost" 
                                  className="h-8 w-8 hover:bg-red-50 hover:text-red-600" 
                                  aria-label="Delete"
                                  onClick={() => setSelectedUserForDelete(u)}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                )}
              </div>
            </CardContent>

            <CardContent className="p-4 mt-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="text-sm text-gray-600">
                  Menampilkan <span className="font-medium text-gray-900">{startIdx + 1}-{Math.min(startIdx + rowsPerPage, filtered.length)}</span> dari <span className="font-medium text-gray-900">{filtered.length}</span> pengguna
                </div>
                
                <div className="flex items-center gap-3">
                  <Select
                    value={String(rowsPerPage)}
                    onValueChange={(v) => {
                      const n = Number(v);
                      if (!Number.isNaN(n)) {
                        setRowsPerPage(n);
                        setCurrentPage(1);
                      }
                    }}
                  >
                    <SelectTrigger className="w-[140px] border-gray-200">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="5">5/halaman</SelectItem>
                      <SelectItem value="8">8/halaman</SelectItem>
                      <SelectItem value="10">10/halaman</SelectItem>
                      <SelectItem value="20">20/halaman</SelectItem>
                    </SelectContent>
                  </Select>
                  
                  <div className="flex items-center gap-1">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                      disabled={safePage === 1}
                      className="h-9 w-9 border-gray-200 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200 disabled:opacity-50"
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    
                    <div className="flex items-center px-3 text-sm font-medium text-gray-700">
                      {safePage} / {totalPages}
                    </div>
                    
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                      disabled={safePage === totalPages}
                      className="h-9 w-9 border-gray-200 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200 disabled:opacity-50"
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      
      <CreateUserModal />
      <ChangeRoleModal 
        user={selectedUserForRole} 
        open={!!selectedUserForRole} 
        onClose={() => setSelectedUserForRole(null)} 
      />
      <DeleteUserDialog 
        user={selectedUserForDelete} 
        open={!!selectedUserForDelete} 
        onClose={() => setSelectedUserForDelete(null)} 
      />
    </div>
  );
}