package com.appverse.service.impl;

import com.appverse.entity.App;
import com.appverse.entity.Bookmark;
import com.appverse.entity.User;
import com.appverse.exception.BadRequestException;
import com.appverse.exception.DuplicateResourceException;
import com.appverse.exception.ResourceNotFoundException;
import com.appverse.repository.AppRepository;
import com.appverse.repository.BookmarkRepository;
import com.appverse.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class BookmarkService {

    private final BookmarkRepository bookmarkRepository;
    private final UserRepository userRepository;
    private final AppRepository appRepository;

    @Transactional
    public Bookmark addBookmark(Long userId, Long appId) {
        if (bookmarkRepository.existsByUserIdAndAppId(userId, appId)) {
            throw new DuplicateResourceException("App already bookmarked");
        }
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User", userId));
        App app = appRepository.findById(appId)
                .orElseThrow(() -> new ResourceNotFoundException("App", appId));

        return bookmarkRepository.save(Bookmark.builder()
                .user(user)
                .app(app)
                .build());
    }

    @Transactional
    public void removeBookmark(Long userId, Long appId) {
        Bookmark bookmark = bookmarkRepository.findByUserIdAndAppId(userId, appId)
                .orElseThrow(() -> new ResourceNotFoundException("Bookmark", appId));
        bookmarkRepository.delete(bookmark);
    }

    public List<Bookmark> listBookmarks(Long userId) {
        return bookmarkRepository.findByUserIdOrderByCreatedAtDesc(userId);
    }
}
