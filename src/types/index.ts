export interface SelectOption {
  label: string;
  value: string;
}

export interface DatasetSummary {
  id: string;
  name: string;
  owner: string;
  updatedAt: string;
  status: "draft" | "published";
}
