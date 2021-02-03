import React, { FC } from "react";
import { Pagination } from "antd";

interface IProps {
    "total": number;
    "page": number;
    "limit": number;
    "setPage": (page: number) => void;
}

const ListingsPagination: FC<IProps> = ({ total, limit, page, setPage }) => {
    return (
        <Pagination
            current={page}
            total={total}
            defaultCurrent={limit}
            hideOnSinglePage
            showLessItems
            onChange={setPage}
            className="listings-pagination"
        />
    );
};

export default ListingsPagination;
