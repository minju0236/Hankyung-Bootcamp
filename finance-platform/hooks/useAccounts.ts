'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

type CreateAccountInput = {
  accountNumber: string;
  accountName: string;
  balance: number;
};

type UpdateAccountInput = {
  id: number;
  accountName: string;
  status: 'active' | 'closed';
};

async function fetchAccounts() {
  const response = await fetch('/api/accounts');

  if (!response.ok) {
    throw new Error('계좌 목록 조회 실패');
  }

  return response.json();
}

async function createAccount(input: CreateAccountInput) {
  const response = await fetch('/api/accounts', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(input)
  });

  if (!response.ok) {
    throw new Error('계좌 등록 실패');
  }

  return response.json();
}

async function updateAccount(input: UpdateAccountInput) {
  const response = await fetch(`/api/accounts/${input.id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      accountName: input.accountName,
      status: input.status
    })
  });

  if (!response.ok) {
    throw new Error('계좌 수정 실패');
  }

  return response.json();
}

async function deleteAccount(id: number) {
  const response = await fetch(`/api/accounts/${id}`, {
    method: 'DELETE'
  });

  if (!response.ok) {
    throw new Error('계좌 삭제 실패');
  }

  return response.json();
}

export function useAccounts() {
  const queryClient = useQueryClient();

  const accountsQuery = useQuery({
    queryKey: ['accounts'],
    queryFn: fetchAccounts
  });

  const createMutation = useMutation({
    mutationFn: createAccount,
    onSuccess: function () {
      queryClient.invalidateQueries({ queryKey: ['accounts'] });
    }
  });

  const updateMutation = useMutation({
    mutationFn: updateAccount,
    onSuccess: function () {
      queryClient.invalidateQueries({ queryKey: ['accounts'] });
    }
  });

  const deleteMutation = useMutation({
    mutationFn: deleteAccount,
    onSuccess: function () {
      queryClient.invalidateQueries({ queryKey: ['accounts'] });
    }
  });

  return {
    accountsQuery,
    createMutation,
    updateMutation,
    deleteMutation
  };
}