#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import readline from 'readline';

// Get __dirname equivalent in ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Create readline interface
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Helper function untuk membuat directory jika belum ada
function createDirectory(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
}

// Helper function untuk membuat file
function createFile(filePath, content) {
  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, content);
    console.log(`✅ Created: ${filePath}`);
  } else {
    console.log(`⚠️  File already exists: ${filePath}`);
  }
}

// Function untuk menentukan apakah route adalah dynamic
function isDynamicRoute(routePath) {
  return routePath.includes('[') && routePath.includes(']');
}

// Template untuk page component
function getPageTemplate(pageName, isProtected, isDynamic = false) {
  const componentName = pageName.charAt(0).toUpperCase() + pageName.slice(1);
  
  if (isDynamic) {
    if (isProtected) {
      return `import React from 'react';
import { ${componentName}DetailView } from './components/${pageName}-detail-view';
import { useAuth } from '@/lib/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { useParams } from 'next/navigation';

const ${componentName}DetailPage = () => {
  const { isAuthenticated, loading: authLoading } = useAuth();
  const router = useRouter();
  const params = useParams();
  const { id } = params;

  // Redirect if not authenticated
  React.useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/auth/login');
    }
  }, [isAuthenticated, authLoading, router]);

  if (authLoading) {
    return <LoadingSpinner />;
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="container mx-auto py-8">
      <${componentName}DetailView id={id as string} />
    </div>
  );
};

export default ${componentName}DetailPage;
`;
    } else {
      return `import React from 'react';
import { ${componentName}DetailView } from './components/${pageName}-detail-view';
import { useParams } from 'next/navigation';

const ${componentName}DetailPage = () => {
  const params = useParams();
  const { id } = params;

  return (
    <div className="container mx-auto py-8">
      <${componentName}DetailView id={id as string} />
    </div>
  );
};

export default ${componentName}DetailPage;
`;
    }
  } else {
    if (isProtected) {
      return `import React from 'react';
import { ${componentName}ListView } from './components/${pageName}-list-view';
import { useAuth } from '@/lib/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { LoadingSpinner } from '@/components/ui/loading-spinner';

const ${componentName}ListPage = () => {
  const { isAuthenticated, loading: authLoading } = useAuth();
  const router = useRouter();

  // Redirect if not authenticated
  React.useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/auth/login');
    }
  }, [isAuthenticated, authLoading, router]);

  if (authLoading) {
    return <LoadingSpinner />;
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="container mx-auto py-8">
      <${componentName}ListView />
    </div>
  );
};

export default ${componentName}ListPage;
`;
    } else {
      return `import React from 'react';
import { ${componentName}ListView } from './components/${pageName}-list-view';

const ${componentName}ListPage = () => {
  return (
    <div className="container mx-auto py-8">
      <${componentName}ListView />
    </div>
  );
};

export default ${componentName}ListPage;
`;
    }
  }
}

// Template untuk list view component
function getListViewTemplate(pageName) {
  const componentName = pageName.charAt(0).toUpperCase() + pageName.slice(1);
  
  return `import React from 'react';
import { use${componentName} } from '../hooks/use${componentName}';
import { use${componentName}Store } from '../store/${pageName}-store';
import { ${componentName}List } from './${pageName}-list';
import { ${componentName}Header } from './${pageName}-header';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { ErrorAlert } from '@/components/ui/error-alert';

export const ${componentName}ListView = () => {
  const { data, loading, error, refetch } = use${componentName}();
  const { 
    isLoading, 
    modalOpen, 
    searchTerm,
    setSearchTerm,
    setModalOpen 
  } = use${componentName}Store();

  const handleSearch = (term: string) => {
    setSearchTerm(term);
  };

  const handleOpenModal = () => {
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
  };

  if (error) {
    return <ErrorAlert message={error.message} onRetry={refetch} />;
  }

  return (
    <div className="${pageName}-list-view">
      <${componentName}Header 
        onSearch={handleSearch}
        onOpenModal={handleOpenModal}
        searchTerm={searchTerm}
      />
      
      {isLoading ? (
        <LoadingSpinner />
      ) : (
        <${componentName}List items={data} />
      )}
    </div>
  );
};
`;
}

// Template untuk detail view component
function getDetailViewTemplate(pageName) {
  const componentName = pageName.charAt(0).toUpperCase() + pageName.slice(1);
  
  return `import React from 'react';
import { use${componentName} } from '../hooks/use${componentName}';
import { ${componentName}Detail } from './${pageName}-detail';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { ErrorAlert } from '@/components/ui/error-alert';

interface ${componentName}DetailViewProps {
  id: string;
}

export const ${componentName}DetailView = ({ id }: ${componentName}DetailViewProps) => {
  const { use${componentName}ById } = use${componentName}();
  const { data: item, isLoading, error, refetch } = use${componentName}ById(id);

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <ErrorAlert message={error.message} onRetry={refetch} />;
  }

  if (!item) {
    return <div className="text-center py-8">Item not found</div>;
  }

  return (
    <div className="${pageName}-detail-view">
      <${componentName}Detail item={item} />
    </div>
  );
};
`;
}

// Template untuk header component
function getHeaderTemplate(pageName) {
  const componentName = pageName.charAt(0).toUpperCase() + pageName.slice(1);
  
  return `import React from 'react';

interface ${componentName}HeaderProps {
  onSearch?: (term: string) => void;
  onOpenModal?: () => void;
  searchTerm?: string;
}

export const ${componentName}Header = ({ 
  onSearch, 
  onOpenModal,
  searchTerm = '' 
}: ${componentName}HeaderProps) => {
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    onSearch?.(e.target.value);
  };

  return (
    <div className="${pageName}-header mb-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">${componentName} Management</h1>
          <p className="text-gray-600 mt-2">Manage your ${pageName} here</p>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="relative">
            <input
              type="text"
              placeholder="Search..."
              value={searchTerm}
              onChange={handleSearch}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <svg 
              className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          
          <button
            onClick={onOpenModal}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Add New
          </button>
        </div>
      </div>
    </div>
  );
};
`;
}

// Template untuk list component
function getListTemplate(pageName) {
  const componentName = pageName.charAt(0).toUpperCase() + pageName.slice(1);
  
  return `import React from 'react';
import { ${componentName}Item } from './${pageName}-item';
import Link from 'next/link';

interface ${componentName}Item {
  id: string;
  name: string;
  // Add more properties based on your data structure
}

interface ${componentName}ListProps {
  items: ${componentName}Item[];
}

export const ${componentName}List = ({ items }: ${componentName}ListProps) => {
  return (
    <div className="${pageName}-list grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {items.map((item) => (
        <Link key={item.id} href="/${pageName}/\${item.id}">
          <${componentName}Item item={item} />
        </Link>
      ))}
    </div>
  );
};
`;
}

// Template untuk item component
function getItemTemplate(pageName) {
  const componentName = pageName.charAt(0).toUpperCase() + pageName.slice(1);
  
  return `import React from 'react';

interface ${componentName}Item {
  id: string;
  name: string;
  // Add more properties based on your data structure
}

interface ${componentName}ItemProps {
  item: ${componentName}Item;
}

export const ${componentName}Item = ({ item }: ${componentName}ItemProps) => {
  return (
    <div className="${pageName}-item p-6 border border-gray-200 rounded-lg hover:shadow-md transition-shadow cursor-pointer">
      <h3 className="font-semibold text-lg text-gray-900">{item.name}</h3>
      <p className="text-gray-600 text-sm mt-2">ID: {item.id}</p>
    </div>
  );
};
`;
}

// Template untuk detail component
function getDetailTemplate(pageName) {
  const componentName = pageName.charAt(0).toUpperCase() + pageName.slice(1);
  
  return `import React from 'react';

interface ${componentName} {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  // Add more properties based on your data structure
}

interface ${componentName}DetailProps {
  item: ${componentName};
}

export const ${componentName}Detail = ({ item }: ${componentName}DetailProps) => {
  return (
    <div className="${pageName}-detail">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">{item.name}</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Details</h2>
            <div className="space-y-3">
              <div>
                <span className="font-medium text-gray-700">ID:</span>
                <span className="ml-2 text-gray-600">{item.id}</span>
              </div>
              <div>
                <span className="font-medium text-gray-700">Created:</span>
                <span className="ml-2 text-gray-600">{item.createdAt}</span>
              </div>
              <div>
                <span className="font-medium text-gray-700">Updated:</span>
                <span className="ml-2 text-gray-600">{item.updatedAt}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
`;
}

// Template untuk types
function getTypesTemplate(pageName) {
  const componentName = pageName.charAt(0).toUpperCase() + pageName.slice(1);
  
  return `export interface ${componentName} {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  // Add more properties based on your API response
}

export interface Create${componentName}Input {
  name: string;
  // Add more properties for creation
}

export interface Update${componentName}Input {
  id: string;
  name?: string;
  // Add more properties for updates
}

export interface ${componentName}Filters {
  search?: string;
  limit?: number;
  offset?: number;
  // Add more filter properties
}
`;
}

// Template untuk hooks
function getHookTemplate(pageName) {
  const componentName = pageName.charAt(0).toUpperCase() + pageName.slice(1);
  
  return `import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ${componentName}Service } from '../service/${pageName}-service';
import { ${componentName}, Create${componentName}Input, Update${componentName}Input, ${componentName}Filters } from '../types/${pageName}-types';
import { use${componentName}Store } from '../store/${pageName}-store';

export const use${componentName} = () => {
  const queryClient = useQueryClient();
  const { 
    searchTerm, 
    filters, 
    setLoading,
    setCreating,
    setEditing 
  } = use${componentName}Store();

  // GET all ${pageName} dengan filters
  const { data, isLoading, error, refetch } = useQuery<${componentName}[]>({
    queryKey: ['${pageName}', { ...filters, search: searchTerm }],
    queryFn: () => {
      const searchFilters: ${componentName}Filters = { 
        ...filters, 
        search: searchTerm 
      };
      return ${componentName}Service.getAll(searchFilters);
    },
  });

  // GET single ${pageName}
  const use${componentName}ById = (id: string) => {
    return useQuery<${componentName}>({
      queryKey: ['${pageName}', id],
      queryFn: () => ${componentName}Service.getById(id),
      enabled: !!id,
    });
  };

  // CREATE ${pageName}
  const createMutation = useMutation({
    mutationFn: (input: Create${componentName}Input) => ${componentName}Service.create(input),
    onMutate: () => setCreating(true),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['${pageName}'] });
    },
    onSettled: () => setCreating(false),
  });

  // UPDATE ${pageName}
  const updateMutation = useMutation({
    mutationFn: ({ id, input }: { id: string; input: Update${componentName}Input }) => 
      ${componentName}Service.update(id, input),
    onMutate: () => setEditing(true),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['${pageName}'] });
      queryClient.invalidateQueries({ queryKey: ['${pageName}', 'detail'] });
    },
    onSettled: () => setEditing(false),
  });

  // DELETE ${pageName}
  const deleteMutation = useMutation({
    mutationFn: (id: string) => ${componentName}Service.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['${pageName}'] });
    },
  });

  return {
    // Data
     data || [],
    loading: isLoading,
    error,
    
    // Actions
    refetch,
    create${componentName}: createMutation.mutate,
    update${componentName}: updateMutation.mutate,
    delete${componentName}: deleteMutation.mutate,
    
    // Status
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
    
    // Detail
    use${componentName}ById,
  };
};
`;
}

// Template untuk service
function getServiceTemplate(pageName) {
  const componentName = pageName.charAt(0).toUpperCase() + pageName.slice(1);
  
  return `import { apiClient } from '@/lib/api/client';
import { ${componentName}, Create${componentName}Input, Update${componentName}Input, ${componentName}Filters } from '../types/${pageName}-types';

export const ${componentName}Service = {
  async getAll(filters: ${componentName}Filters = {}) {
    const response = await apiClient.get<${componentName}[]>('/${pageName}', { params: filters });
    return response.data;
  },

  async getById(id: string) {
    const response = await apiClient.get<${componentName}>(\`/${pageName}/\${id}\`);
    return response.data;
  },

  async create(input: Create${componentName}Input) {
    const response = await apiClient.post<${componentName}>(\`/${pageName}\`, input);
    return response.data;
  },

  async update(id: string, input: Update${componentName}Input) {
    const response = await apiClient.put<${componentName}>(\`/${pageName}/\${id}\`, input);
    return response.data;
  },

  async delete(id: string) {
    const response = await apiClient.delete(\`/${pageName}/\${id}\`);
    return response.data;
  }
};
`;
}

// Template untuk zustand UI store
function getStoreTemplate(pageName) {
  const componentName = pageName.charAt(0).toUpperCase() + pageName.slice(1);
  
  return `import { create } from 'zustand';

interface ${componentName}UIState {
  // UI State
  isLoading: boolean;
  isCreating: boolean;
  isEditing: boolean;
  selectedId: string | null;
  searchTerm: string;
  filters: Record<string, any>;
  modalOpen: boolean;
  sidebarOpen: boolean;
  
  // Actions
  setLoading: (loading: boolean) => void;
  setCreating: (creating: boolean) => void;
  setEditing: (editing: boolean) => void;
  setSelectedId: (id: string | null) => void;
  setSearchTerm: (term: string) => void;
  setFilters: (filters: Record<string, any>) => void;
  setModalOpen: (open: boolean) => void;
  setSidebarOpen: (open: boolean) => void;
  reset: () => void;
}

const initialState = {
  isLoading: false,
  isCreating: false,
  isEditing: false,
  selectedId: null,
  searchTerm: '',
  filters: {},
  modalOpen: false,
  sidebarOpen: false,
};

export const use${componentName}Store = create<${componentName}UIState>((set) => ({
  ...initialState,
  
  setLoading: (loading) => set({ isLoading: loading }),
  setCreating: (creating) => set({ isCreating: creating }),
  setEditing: (editing) => set({ isEditing: editing }),
  setSelectedId: (id) => set({ selectedId: id }),
  setSearchTerm: (term) => set({ searchTerm: term }),
  setFilters: (filters) => set({ filters }),
  setModalOpen: (open) => set({ modalOpen: open }),
  setSidebarOpen: (open) => set({ sidebarOpen: open }),
  reset: () => set(initialState),
}));
`;
}

// Fungsi utama untuk generate page dengan support dynamic routing
function generatePage(pageName, location, isProtected) {
  try {
    // Check if using src/app structure
    const srcAppDir = path.join(process.cwd(), 'src', 'app');
    const appDir = fs.existsSync(srcAppDir) ? srcAppDir : path.join(process.cwd(), 'app');
    
    // Check if this is a dynamic route
    const isDynamic = isDynamicRoute(location);
    const basePath = isDynamic ? location.split('[')[0].slice(0, -1) || location.replace(/\[.*\]/g, '') : location;
    const pageDir = path.join(appDir, basePath);
    
    // Create main page directory
    createDirectory(pageDir);
    
    if (isDynamic) {
      // For dynamic routes, create the dynamic folder structure
      const dynamicDir = path.join(appDir, location);
      createDirectory(dynamicDir);
      
      // Create dynamic page file
      const pagePath = path.join(dynamicDir, 'page.tsx');
      createFile(pagePath, getPageTemplate(pageName, isProtected, true));
      
      // Create components directory
      const componentsDir = path.join(dynamicDir, 'components');
      createDirectory(componentsDir);
      
      // Create detail view components
      createFile(path.join(componentsDir, `${pageName}-detail-view.tsx`), getDetailViewTemplate(pageName));
      createFile(path.join(componentsDir, `${pageName}-detail.tsx`), getDetailTemplate(pageName));
      
    } else {
      // Create regular page file
      const pagePath = path.join(pageDir, 'page.tsx');
      createFile(pagePath, getPageTemplate(pageName, isProtected, false));
      
      // Create components directory
      const componentsDir = path.join(pageDir, 'components');
      createDirectory(componentsDir);
      
      // Create list view components
      createFile(path.join(componentsDir, `${pageName}-list-view.tsx`), getListViewTemplate(pageName));
      createFile(path.join(componentsDir, `${pageName}-header.tsx`), getHeaderTemplate(pageName));
      createFile(path.join(componentsDir, `${pageName}-list.tsx`), getListTemplate(pageName));
      createFile(path.join(componentsDir, `${pageName}-item.tsx`), getItemTemplate(pageName));
    }
    
    // Create types directory and file (shared)
    const typesDir = path.join(pageDir, 'types');
    createDirectory(typesDir);
    createFile(path.join(typesDir, `${pageName}-types.ts`), getTypesTemplate(pageName));
    
    // Create hooks directory and file (shared)
    const hooksDir = path.join(pageDir, 'hooks');
    createDirectory(hooksDir);
    createFile(path.join(hooksDir, `use${pageName.charAt(0).toUpperCase() + pageName.slice(1)}.ts`), getHookTemplate(pageName));
    
    // Create service directory and file (shared)
    const serviceDir = path.join(pageDir, 'service');
    createDirectory(serviceDir);
    createFile(path.join(serviceDir, `${pageName}-service.ts`), getServiceTemplate(pageName));
    
    // Create store directory and file (shared)
    const storeDir = path.join(pageDir, 'store');
    createDirectory(storeDir);
    createFile(path.join(storeDir, `${pageName}-store.ts`), getStoreTemplate(pageName));
    
    console.log(`\n🎉 Successfully generated ${pageName} page!`);
    console.log(`📁 Location: ${path.relative(process.cwd(), pageDir)}${isProtected ? ' (Protected)' : ''}`);
    console.log(`🔗 Route type: ${isDynamic ? 'Dynamic' : 'Static'}`);
    
    if (isDynamic) {
      console.log(`📦 Generated components:`);
      console.log(`   - Dynamic page component`);
      console.log(`   - Detail view component`);
      console.log(`   - Detail component`);
    } else {
      console.log(`📦 Generated components:`);
      console.log(`   - List page component`);
      console.log(`   - List view component`);
      console.log(`   - Header component`);
      console.log(`   - List component`);
      console.log(`   - Item component`);
    }
    
    console.log(`   - Types file`);
    console.log(`   - Custom hook`);
    console.log(`   - Service file`);
    console.log(`   - UI store`);
    
  } catch (error) {
    console.error('❌ Error generating page:', error.message);
    process.exit(1);
  }
}

// Fungsi untuk prompt pertanyaan
function askQuestion(question) {
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      resolve(answer);
    });
  });
}

// Fungsi utama interactive
async function interactiveGenerate() {
  console.log('🚀 Next.js Page Generator');
  console.log('========================\n');
  
  try {
    // Get page name
    const pageName = await askQuestion('Enter page name (e.g., posts, users): ');
    if (!pageName) {
      console.log('❌ Page name is required');
      rl.close();
      return;
    }
    
    // Ask if dynamic route
    const dynamicAnswer = await askQuestion('Is this a dynamic route? (y/N): ');
    const isDynamic = dynamicAnswer.toLowerCase() === 'y' || dynamicAnswer.toLowerCase() === 'yes';
    
    let location;
    if (isDynamic) {
      const slugName = await askQuestion('Enter slug parameter name (default: id): ');
      const slug = slugName || 'id';
      location = `${pageName}/[${slug}]`;
    } else {
      location = await askQuestion(`Enter location (default: ${pageName}): `);
      location = location || pageName;
    }
    
    // Ask if protected
    const protectedAnswer = await askQuestion('Is this a protected page? (y/N): ');
    const isProtected = protectedAnswer.toLowerCase() === 'y' || protectedAnswer.toLowerCase() === 'yes';
    
    // Confirm
    console.log(`\n📝 Summary:`);
    console.log(`   Page name: ${pageName}`);
    console.log(`   Location: ${location}`);
    console.log(`   Type: ${isDynamic ? 'Dynamic' : 'Static'}`);
    console.log(`   Protected: ${isProtected ? 'Yes' : 'No'}`);
    
    const confirm = await askQuestion('\nProceed with generation? (Y/n): ');
    if (confirm.toLowerCase() === 'n' || confirm.toLowerCase() === 'no') {
      console.log('❌ Generation cancelled');
      rl.close();
      return;
    }
    
    // Generate page
    generatePage(pageName, location, isProtected);
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    rl.close();
  }
}

// CLI Arguments parsing
const args = process.argv.slice(2);
const pageName = args[0];

// Check if running in interactive mode
if (!pageName) {
  // Run interactive mode
  interactiveGenerate();
} else {
  // Run command line mode
  const locationFlag = args.find(arg => arg.startsWith('--location='));
  const protectedFlag = args.includes('--protected');

  const location = locationFlag ? locationFlag.split('=')[1] : pageName;
  const isProtected = protectedFlag;

  // Validasi location
  if (locationFlag && !location) {
    console.log('❌ Invalid location format. Use --location=path/to/page');
    process.exit(1);
  }

  // Generate page
  generatePage(pageName, location, isProtected);
}