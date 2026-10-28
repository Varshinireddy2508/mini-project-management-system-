package com.miniproject.management.dto;

import com.miniproject.management.entity.ProjectStatus;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDate;

public class ProjectRequest {

    @NotBlank(message = "Project name cannot be empty")
    private String name;

    @NotBlank(message = "Description cannot be empty")
    private String description;

    @NotNull(message = "Start date is required")
    private LocalDate startDate;

    @NotNull(message = "Deadline is required")
    private LocalDate deadline;

    @NotNull(message = "Status must be one of: NOT_STARTED, IN_PROGRESS, COMPLETED")
    private ProjectStatus status;

    public ProjectRequest() {
    }

    public ProjectRequest(String name, String description, LocalDate startDate, LocalDate deadline, ProjectStatus status) {
        this.name = name;
        this.description = description;
        this.startDate = startDate;
        this.deadline = deadline;
        this.status = status;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public LocalDate getStartDate() {
        return startDate;
    }

    public void setStartDate(LocalDate startDate) {
        this.startDate = startDate;
    }

    public LocalDate getDeadline() {
        return deadline;
    }

    public void setDeadline(LocalDate deadline) {
        this.deadline = deadline;
    }

    public ProjectStatus getStatus() {
        return status;
    }

    public void setStatus(ProjectStatus status) {
        this.status = status;
    }
}
