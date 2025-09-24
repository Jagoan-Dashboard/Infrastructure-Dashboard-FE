import React from 'react';
import { useSumber-daya-air } from '../hooks/useSumber-daya-air';
import { useSumber-daya-airStore } from '../store/sumber-daya-air-store';
import { Sumber-daya-airList } from './sumber-daya-air-list';
import { Sumber-daya-airHeader } from './sumber-daya-air-header';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { ErrorAlert } from '@/components/ui/error-alert';

export const Sumber-daya-airListView = () => {
  const { data, loading, error, refetch } = useSumber-daya-air();
  const { 
    isLoading, 
    modalOpen, 
    searchTerm,
    setSearchTerm,
    setModalOpen 
  } = useSumber-daya-airStore();

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
    <div className="sumber-daya-air-list-view">
      <Sumber-daya-airHeader 
        onSearch={handleSearch}
        onOpenModal={handleOpenModal}
        searchTerm={searchTerm}
      />
      
      {isLoading ? (
        <LoadingSpinner />
      ) : (
        <Sumber-daya-airList items={data} />
      )}
    </div>
  );
};
