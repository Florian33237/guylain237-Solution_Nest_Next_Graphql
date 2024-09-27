import Link from "next/link";
import ReactPaginate from "react-paginate";
import React, { useState, useEffect } from "react";
import { fetchPersons } from "./api/api";
import { Personne } from "./api/interface";

const PG_ITM = 10;

export default function Perso() {
  const [datas, setDatas] = useState<Personne[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [currentItems, setCurrentItems] = useState<Personne[]>([]);
  const [pageCount, setPageCount] = useState<number>(0);
  const [itemOffset, setItemOffset] = useState<number>(0);

  useEffect(() => {
    const getData = async () => {
      const result = await fetchPersons();
      setDatas(result);
      setPageCount(Math.ceil(result.length / PG_ITM));
      setCurrentItems(result.slice(0, PG_ITM));
      setLoading(false);
    };

    getData();
  }, []);

  useEffect(() => {
    const endOffset = itemOffset + PG_ITM;
    setCurrentItems(datas.slice(itemOffset, endOffset));
  }, [itemOffset, datas]);

  const handlePageClick = (event: { selected: number }) => {
    const newOffset = (event.selected * PG_ITM) % datas.length;
    setItemOffset(newOffset);
  };

  if (loading) {
    return <p>Chargement des données...</p>;
  }

  if (!datas || datas.length === 0) {
    return (
      <p>
        les donneés des personnes sont mal chargées, Veuillez réessayer plus
        tard.
      </p>
    );
  }

  return (
    <div className="container">
      <div className="row justify-content-center">
        <div className="col-12 col-md-10">
          <div className="table-responsive">
            <table className="table table-striped table-hover table-bordered table-sm text-center">
              <caption className="caption-top text-center">
                <h1 className="fw-bold text-black">Listes des personnes</h1>
              </caption>

              <thead className="table-dark">
                <tr>
                  <th scope="col">#</th>
                  <th scope="col">Nom</th>
                  <th scope="col">Prénom</th>
                  <th scope="col">téléphone</th>
                  <th scope="col">Details</th>
                </tr>
              </thead>
              <tbody>
                {currentItems.map((item) => (
                  <tr key={item.id}>
                    <th scope="row">{item.id}</th>
                    <td>{item.lastName}</td>
                    <td>{item.firstName}</td>
                    <td>{item.phoneNumber}</td>
                    <td>
                      <Link href={`/tasks/person/${item.id}`}>
                        <button className="btn btn-outline-success">
                          Detail
                        </button>
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <ReactPaginate
              breakLabel="..."
              nextLabel="Suiv >"
              onPageChange={handlePageClick}
              pageRangeDisplayed={5}
              pageCount={pageCount}
              previousLabel="< Pré"
              containerClassName="pagination d-flex justify-content-center flex-wrap"
              pageClassName="page-item"
              pageLinkClassName="page-link"
              previousClassName="page-item"
              previousLinkClassName="page-link"
              nextClassName="page-item"
              nextLinkClassName="page-link"
              breakClassName="page-item"
              breakLinkClassName="page-link"
              activeClassName="active"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
