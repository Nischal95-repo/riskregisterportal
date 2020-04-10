export const STATUS_LIST = [
  { id: 1, value: "Active" },
  { id: 2, value: "Suspended" },
  { id: 3, value: "Terminated" },
  {
    id: 4,
    value: "Pending For Activation",
  },
];

export function getStausById(Id) {
  var STATUS_LIST = [
    { id: 1, value: "Active" },
    { id: 2, value: "Suspended" },
    { id: 3, value: "Terminated" },
    {
      id: 4,
      value: "Pending For Activation",
    },
  ];
  return STATUS_LIST[Id - 1].value;
}
