import { component$ } from '@builder.io/qwik';
import { Columns, TableServerPagination } from '../../../../components/table/table-server-pagination';
import { DocumentHead } from '@builder.io/qwik-city';

export default component$(() => {
  const columns: Columns = {
    name: { displayName: 'Name' },
    email: {},
    role: {},
  };

  return (
    <>
      <TableServerPagination endpoint={`${process.env.API_DOMAIN}/api/v1/users`} columns={columns} />
    </>
  );
});

export const head: DocumentHead = {
  title: 'Reduced.to | Admin Dashboard - Users',
  meta: [
    {
      name: 'title',
      content: 'Reduced.to | Admin Dashboard - Users',
    },
    {
      name: 'description',
      content: 'Reduced.to | Admin Dashboard - See all users',
    },
    {
      property: 'og:type',
      content: 'website',
    },
    {
      property: 'og:url',
      content: 'https://reduced.to/dashboard',
    },
    {
      property: 'og:title',
      content: 'Reduced.to | Admin Dashboard - Users',
    },
    {
      property: 'og:description',
      content: 'Reduced.to | Admin Dashboard - See all users',
    },
    {
      property: 'twitter:card',
      content: 'summary',
    },
    {
      property: 'twitter:title',
      content: 'Reduced.to | Admin Dashboard - Users',
    },
    {
      property: 'twitter:description',
      content: 'Reduced.to | Admin Dashboard - See all users',
    },
  ],
};
