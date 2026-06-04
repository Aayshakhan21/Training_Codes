2) One to Many / Many to One --->

        a. bidirectional - One to Many ---> ( Department ---> Employees )

Where one entity class (Parent class) can have multiple child entities.

Taking an example of Department and Employee:

One Department can contain many Employees.
Many Employees belong to one Department.

In One-To-Many mapping:
- Parent entity contains collection/list of child entities.
- Child entity contains reference of parent entity using foreign key.

Syntax:

@Entity
@OneToMany(mappedBy = "department", cascade = CascadeType.ALL)

In Department Parent Class:

// One Department can have many Employees
@OneToMany(mappedBy = "department", cascade = CascadeType.ALL)
private List<Employee> employees = new ArrayList<>();

Here:
- mappedBy = "department"
  tells Hibernate that mapping is controlled by Employee class.
- cascade = CascadeType.ALL
  automatically applies operations from parent to child entities.

------------------------------------------------------------

In Employee Child Class:

@ManyToOne
@JoinColumn(name = "department_id")

private Department department;

Here:
- department_id foreign key will be created in Employee table.
- It stores reference of Department primary key.

------------------------------------------------------------

Database Tables:

1. departments
2. employees

Foreign key:
department_id will be created in employees table.

------------------------------------------------------------

Cascade:

If we save Department entity,
all associated Employee entities also get saved automatically.

Without cascade:
we have to save Department and Employees separately.

With cascade:
Hibernate automatically saves child entities.

------------------------------------------------------------

Cascade Types:

Persist --> Save child when saving parent

Merge --> Update child when updating parent

Remove --> Delete child when deleting parent

All --> Includes all above operations

------------------------------------------------------------

Bidirectional Mapping:

Department can access Employees:

department.getEmployees()

Employee can access Department:

employee.getDepartment()

because both entities hold references of each other.

------------------------------------------------------------

Example:

Department department = new Department("IT");

Employee employee1 = new Employee("Vishal", 50000);

department.addEmployee(employee1);

session.persist(department);

Hibernate automatically:
1. saves Department
2. saves Employee
3. creates foreign key relationship

------------------------------------------------------------

Important Notes:

@OneToMany
used in Parent Entity

@ManyToOne
used in Child Entity

Foreign key always created in Child Table.

Parent entity contains collection of Child entities.
