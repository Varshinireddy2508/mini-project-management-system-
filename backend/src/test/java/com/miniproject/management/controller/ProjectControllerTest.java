package com.miniproject.management.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.miniproject.management.dto.ProjectRequest;
import com.miniproject.management.entity.Project;
import com.miniproject.management.entity.ProjectStatus;
import com.miniproject.management.exception.ResourceNotFoundException;
import com.miniproject.management.service.ProjectService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.time.LocalDate;
import java.util.Collections;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(ProjectController.class)
public class ProjectControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private ProjectService projectService;

    private Project sampleProject;
    private ProjectRequest validRequest;

    @BeforeEach
    void setUp() {
        sampleProject = new Project(
                1L,
                "Campus Navigation App",
                "Indoor mobile navigation app for college campus.",
                LocalDate.of(2026, 11, 1),
                LocalDate.of(2026, 12, 15),
                ProjectStatus.IN_PROGRESS
        );

        validRequest = new ProjectRequest(
                "Campus Navigation App",
                "Indoor mobile navigation app for college campus.",
                LocalDate.of(2026, 11, 1),
                LocalDate.of(2026, 12, 15),
                ProjectStatus.IN_PROGRESS
        );
    }

    @Test
    void testGetAllProjects() throws Exception {
        when(projectService.getAllProjects()).thenReturn(Collections.singletonList(sampleProject));

        mockMvc.perform(get("/api/projects"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].id").value(1L))
                .andExpect(jsonPath("$[0].name").value("Campus Navigation App"))
                .andExpect(jsonPath("$[0].status").value("IN_PROGRESS"));
    }

    @Test
    void testGetProjectByIdSuccess() throws Exception {
        when(projectService.getProjectById(1L)).thenReturn(sampleProject);

        mockMvc.perform(get("/api/projects/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(1L))
                .andExpect(jsonPath("$.name").value("Campus Navigation App"));
    }

    @Test
    void testGetProjectByIdNotFoundReturns404() throws Exception {
        when(projectService.getProjectById(999L))
                .thenThrow(new ResourceNotFoundException("Project not found with id: 999"));

        mockMvc.perform(get("/api/projects/999"))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.status").value(404))
                .andExpect(jsonPath("$.message").value("Project not found with id: 999"));
    }

    @Test
    void testCreateProjectSuccess() throws Exception {
        when(projectService.createProject(any(ProjectRequest.class))).thenReturn(sampleProject);

        mockMvc.perform(post("/api/projects")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(validRequest)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id").value(1L))
                .andExpect(jsonPath("$.name").value("Campus Navigation App"));
    }

    @Test
    void testCreateProjectValidationErrorReturns400() throws Exception {
        ProjectRequest invalidRequest = new ProjectRequest(
                "", // empty name
                "", // empty desc
                null,
                null,
                null
        );

        mockMvc.perform(post("/api/projects")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(invalidRequest)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.status").value(400))
                .andExpect(jsonPath("$.validationErrors.name").exists())
                .andExpect(jsonPath("$.validationErrors.description").exists());
    }

    @Test
    void testUpdateProjectSuccess() throws Exception {
        when(projectService.updateProject(eq(1L), any(ProjectRequest.class))).thenReturn(sampleProject);

        mockMvc.perform(put("/api/projects/1")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(validRequest)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(1L));
    }

    @Test
    void testDeleteProjectSuccess() throws Exception {
        doNothing().when(projectService).deleteProject(1L);

        mockMvc.perform(delete("/api/projects/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message").value("Project deleted successfully"))
                .andExpect(jsonPath("$.id").value(1));
    }
}
