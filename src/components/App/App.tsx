import css from "./App.module.css";
import { useEffect, useState } from "react";

import SearchBar from "../SearchBar/SearchBar";
import { fetchMovie } from "../../services/movieService";
import MovieGrid from "../MovieGrid/MovieGrid";
import Loader from "../Loader/Loader";
import ErrorMessage from "../ErrorMessage/ErrorMessage";
import type { Movie } from "../../types/movie";
import MovieModal from "../MovieModal/MovieModal";
import ReactPaginateModule from "react-paginate";
import type { ReactPaginateProps } from "react-paginate";
import type { ComponentType } from "react";
import { keepPreviousData, useQuery } from "@tanstack/react-query";

type ModuleWithDefault<T> = { default: T };

const ReactPaginate = (
  ReactPaginateModule as unknown as ModuleWithDefault<ComponentType<ReactPaginateProps>>
).default;

export default function App() {
  // const [movies, setMovies] = useState<Movie[]>([]);
  // const [isLoading, setIsLoading] = useState<boolean>(false);
  // const [isError, setIsError] = useState<boolean>(false);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);

  const [query, setQuery] = useState('');
  const [page, setPage] = useState(1);

  const { data, isLoading, isError, isSuccess } = useQuery({
    queryKey: ['movies', query, page],
    queryFn: () => fetchMovie( query, page ),
    enabled: query !== '',
    placeholderData: keepPreviousData,
  });

  const totalPages = data?.total_pages ?? 0;
  const movies = data?.results ?? [];

  useEffect(() => {
    if (isSuccess && data.results.length ===0) {
      console.log("emty")
    }
  },[isSuccess, data]);

  const handleSubmit = async (query: string ) => {
    setSelectedMovie(null);
    setPage(1);
    setQuery(query)
  };
  const handleSelect = (movie: Movie) => {
    setSelectedMovie(movie);
    setIsModalOpen(true);
  };
  const handleClose = () => {
    setIsModalOpen(false);
    setSelectedMovie(null);;
  }
  return (
    <div className={css.app}>
     
      <SearchBar onSubmit={handleSubmit}></SearchBar>
      {
        isSuccess && totalPages > 1 &&
        (<ReactPaginate
        pageCount={totalPages}
        pageRangeDisplayed={5}
        marginPagesDisplayed={1}
        onPageChange={({ selected }) => setPage(selected + 1)}
        forcePage={page - 1}
        containerClassName={css.pagination}
        activeClassName={css.active}
        nextLabel="→"
        previousLabel="←"
        />)}
      {movies.length>0 && <MovieGrid onSelect={handleSelect} movies={movies}/>}
      {isLoading && <Loader />}
      {isError && <ErrorMessage />}
      {isModalOpen && selectedMovie && (
        <MovieModal
          movie={selectedMovie}
          onClose={handleClose}
        />)}
    </div>
  )
}