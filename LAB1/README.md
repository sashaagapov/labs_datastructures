# Lab 1: search methods

Three separate .NET 10 console programs compare search methods on arrays. Their timing figures depend on the machine and input, so no benchmark numbers are quoted here.

| Project | Input and methods | Run from repository root |
| --- | --- | --- |
| [Configurable search](lab1_ds_finding_beta/Program.cs) | Choose array size and filling method; compare searches on the chosen data | `dotnet run --project LAB1/lab1_ds_finding_beta/lab1_ds_finding.csproj` |
| [Fixed-size comparison](lab1_ds_maximum_beta/Program.cs) | Uses 100,000 ordered values and target 99,999; compares linear, sentinel, binary, golden-section and linked-list search | `dotnet run --project LAB1/lab1_ds_maximum_beta/lab1_ds.csproj` |
| [Repeated search](lab1_ds_futuremain/Program.cs) | Search multiple targets in one session; type `exit` to finish | `dotnet run --project LAB1/lab1_ds_futuremain/lab1_ds_testing.csproj` |

For the fixed-size comparison, the target's array index is **99,999**. That is a result of the declared input (`0` through `99,999`), not a measured runtime. All three programs print their own results when run.

[Back to all labs](../README.md).
