package com.aura.staffmanager.entity.converter;

import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;
import java.time.YearMonth;
import java.time.LocalDate;

@Converter(autoApply = true)
public class YearMonthConverter implements AttributeConverter<YearMonth, LocalDate> {

    @Override
    public LocalDate convertToDatabaseColumn(YearMonth yearMonth) {
        if (yearMonth == null) {
            return null;
        }
        return yearMonth.atDay(1);
    }

    @Override
    public YearMonth convertToEntityAttribute(LocalDate date) {
        if (date == null) {
            return null;
        }
        return YearMonth.from(date);
    }
} 