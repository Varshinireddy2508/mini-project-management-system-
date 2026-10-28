package com.miniproject.management.service;

import com.miniproject.management.dto.ProjectRequest;
import com.miniproject.management.entity.Project;
import com.miniproject.management.entity.ProjectStatus;
import com.miniproject.management.exception.BadRequestException;
import com.miniproject.management.exception.ResourceNotFoundException;
import com.miniproject.management.repository.ProjectRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
public class ProjectService {

    private final ProjectRepository projectRepository;

    @Autowired
    public ProjectService(ProjectRepository projectRepository) {
        this.projectRepository = projectRepository;
    }

    @Transactional(readOnly = true)
    public List<Project> getAllProjects() {
        return projectRepository.findAll();
    }

    @Transactional(readOnly = true)
    public Project getProjectById(Long id) {
        return projectRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Project not found with id: " + id));
    }

    public Project createProject(ProjectRequest request) {
        validateDates(request);

        Project project = new Project();
        project.setName(request.getName().trim());
        project.setDescription(request.getDescription().trim());
        project.setStartDate(request.getStartDate());
        project.setDeadline(request.getDeadline());
        project.setStatus(request.getStatus());

        return projectRepository.save(project);
    }

    public Project updateProject(Long id, ProjectRequest request) {
        Project existingProject = getProjectById(id);
        validateDates(request);

        existingProject.setName(request.getName().trim());
        existingProject.setDescription(request.getDescription().trim());
        existingProject.setStartDate(request.getStartDate());
        existingProject.setDeadline(request.getDeadline());
        existingProject.setStatus(request.getStatus());

        return projectRepository.save(existingProject);
    }

    public void deleteProject(Long id) {
        Project project = getProjectById(id);
        projectRepository.delete(project);
    }

    @Transactional(readOnly = true)
    public List<Project> getProjectsByStatus(ProjectStatus status) {
        return projectRepository.findByStatus(status);
    }

    private void validateDates(ProjectRequest request) {
        if (request.getStartDate() != null && request.getDeadline() != null) {
            if (request.getDeadline().isBefore(request.getStartDate())) {
                throw new BadRequestException("Deadline cannot be earlier than start date.");
            }
        }
    }
}
