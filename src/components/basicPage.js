import React, { Component } from "react";
import LayoutContentWrapper from "./utility/layoutWrapper";
import PageHeader from "./utility/pageHeader";
import PageLoading from "./pageLoading";

export const BasicPage = ({ title, loading, children }) => (
  <LayoutContentWrapper>
    <PageHeader>{title}</PageHeader>
    {loading ? <PageLoading /> : children}
  </LayoutContentWrapper>
);
