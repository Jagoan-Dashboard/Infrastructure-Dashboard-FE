import React from 'react';
import { useTata-ruang } from '../hooks/useTata-ruang';
import { useTata-ruangStore } from '../store/tata-ruang-store';
import { Tata-ruangList } from './tata-ruang-list';
import { Tata-ruangHeader } from './tata-ruang-header';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { ErrorAlert } from '@/components/ui/error-alert';

export const Tata-ruangListView = () => {
  const { data, loading, error, refetch } = useTata-ruang();
  const { 
    isLoading, 
    modalOpen, 
    searchTerm,
    setSearchTerm,
    setModalOpen 
  } = useTata-ruangStore();

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
    <div className="tata-ruang-list-view">
      <Tata-ruangHeader 
        onSearch={handleSearch}
        onOpenModal={handleOpenModal}
        searchTerm={searchTerm}
      />
      
      {isLoading ? (
        <LoadingSpinner />
      ) : (
        <Tata-ruangList items={data} />
      )}
    </div>
  );
};
