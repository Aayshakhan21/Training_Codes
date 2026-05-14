function calculateSalary() {

    // Taking input from HTML using IDs
    let empName = document.getElementById("empName").value;
    let basicSalary = Number(document.getElementById("basicSalary").value);
    let workingDays = Number(document.getElementById("workingDays").value);
    let bonus = Number(document.getElementById("bonus").value);

    let totalDays = 30;
    let grossSalary, tax, netSalary;

    // Calculate Gross Salary
    let perDaySalary = basicSalary / totalDays;
    let earnedSalary = perDaySalary * workingDays;
    grossSalary = earnedSalary + bonus;

    // Calculate Tax
    if (grossSalary <= 25000) {
        tax = grossSalary * 0.05;
    } else {
        tax = grossSalary * 0.10;
    }

    // Calculate Net Salary
    netSalary = grossSalary - tax;

    // Display output
    document.getElementById("output").innerHTML =
        "Employee Name : " + empName + "<br>" +
        "Gross Salary  : ₹" + grossSalary + "<br>" +
        "Tax Deduction : ₹" + tax + "<br>" +
        "Net Salary    : ₹" + netSalary;
}
