CREATE TABLE IF NOT EXISTS salaries (
    id BIGSERIAL PRIMARY KEY,
    employee_id BIGINT NOT NULL,
    base_salary DECIMAL(10,2) NOT NULL,
    bonus DECIMAL(10,2) NOT NULL,
    deductions DECIMAL(10,2) NOT NULL,
    net_salary DECIMAL(10,2) NOT NULL,
    month DATE NOT NULL,
    year INTEGER NOT NULL,
    status VARCHAR(20) NOT NULL,
    comments TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_salary_employee FOREIGN KEY (employee_id) REFERENCES employees(id)
); 