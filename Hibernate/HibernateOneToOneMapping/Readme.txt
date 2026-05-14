1) One to One --- >

		a. unidirectional - One to One ---> ( Student --- > ReportCard)

Where one entity class is the owner and having the reference of another entity class via foreign key created by hibernate  in owner class itself (FK will be created in a primary entity itself for a child entity)  where in mysql
FK will be created in child table itself by giving a reference of primary table)

And another class(Child class) is not having the reference of the owner class (because owner or primary class is taking the ownership itself for a child class)

Taking an example of Student and ReportCard

Syntax:
@Entity  and @OneToOne(cascade = CascadeType.ALL)
@joinColumn(name="foreign_Key name") // Generally it will be a unique key ( PK) in child table

In a Student Primary Class ( Which is an owner who is taking an ownership of reportcard i.e. child class) so Student class is holding the reference of report card table .

	//Unidirectional one-to-one mapping of Student with ReportCard
	@OneToOne(cascade=CascadeType.ALL)
	@JoinColumn(name="reportcard_id") // fk in Student table ( which shows that student has a reference of Report Card where id is the PK )
	private ReportCard reportcard;


Cascade -->  If we perform an operation on the parent/owner entity , apply the same operation automatically to the associated child entity

Cascade Types :
Persist --> Save child when saving parent
Merge --> Update child when updating parent
Remove --> Delete child when deleting parent
All --> Includes all above

without cascade manually we have to save the reportcard and student both entities but with cascade Hibernate does it automatically.

In one to one if we query via the student it will work fine but if we try to get the details of student via reportcard  (reportcard.getStudent())
it  will not work because report doesn't hold that reference
