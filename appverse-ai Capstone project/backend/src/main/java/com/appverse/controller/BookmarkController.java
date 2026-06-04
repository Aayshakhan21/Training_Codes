package com.appverse.controller;

import com.appverse.repository.UserRepository;
import com.appverse.service.impl.BookmarkService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/bookmarks")
@RequiredArgsConstructor
@SecurityRequirement(name = "bearerAuth")
@Tag(name = "Bookmarks", description = "User bookmarks and wishlist")
public class BookmarkController {

    private final BookmarkService bookmarkService;
    private final UserRepository userRepository;

    @GetMapping
    @Operation(summary = "List saved apps")
    public ResponseEntity<?> list(@AuthenticationPrincipal UserDetails userDetails) {
        Long userId = resolveUserId(userDetails);
        return ResponseEntity.ok(Map.of("success", true, "data", bookmarkService.listBookmarks(userId)));
    }

    @PostMapping("/{appId}")
    @Operation(summary = "Save an app")
    public ResponseEntity<?> add(@AuthenticationPrincipal UserDetails userDetails, @PathVariable Long appId) {
        Long userId = resolveUserId(userDetails);
        return ResponseEntity.ok(Map.of("success", true, "data", bookmarkService.addBookmark(userId, appId)));
    }

    @DeleteMapping("/{appId}")
    @Operation(summary = "Remove a saved app")
    public ResponseEntity<?> remove(@AuthenticationPrincipal UserDetails userDetails, @PathVariable Long appId) {
        bookmarkService.removeBookmark(resolveUserId(userDetails), appId);
        return ResponseEntity.ok(Map.of("success", true, "message", "Bookmark removed"));
    }

    private Long resolveUserId(UserDetails userDetails) {
        return userRepository.findByEmail(userDetails.getUsername())
                .orElseThrow()
                .getId();
    }
}
