-- Drop the department column if it exists
ALTER TABLE employees DROP COLUMN IF EXISTS department;

-- Ensure department_id has the correct foreign key constraint
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.table_constraints 
        WHERE constraint_name = 'fk_employee_department'
    ) THEN
        ALTER TABLE employees 
            ADD CONSTRAINT fk_employee_department 
            FOREIGN KEY (department_id) 
            REFERENCES departments(id);
    END IF;
END $$; 