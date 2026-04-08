#!/usr/bin/env python3
import subprocess
import os

print("=== Committing WCAG 2.1 Accessibility Changes ===\n")

# The script runs from the scripts directory, so we need to go up one level
repo_root = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
print(f"Repository root: {repo_root}")

# Check if .git directory exists
git_dir = os.path.join(repo_root, '.git')
if not os.path.exists(git_dir):
    print(f"ERROR: .git directory not found at {git_dir}")
    exit(1)

print(f"Found .git directory at: {git_dir}\n")

try:
    # Check current branch
    result = subprocess.run(
        ['git', 'rev-parse', '--abbrev-ref', 'HEAD'],
        cwd=repo_root,
        capture_output=True,
        text=True,
        check=True
    )
    current_branch = result.stdout.strip()
    print(f"Current branch: {current_branch}")
    
    # Check git status
    result = subprocess.run(
        ['git', 'status', '--short'],
        cwd=repo_root,
        capture_output=True,
        text=True,
        check=True
    )
    print(f"\nGit status:\n{result.stdout}")
    
    if not result.stdout.strip():
        print("No changes to commit.")
        exit(0)
    
    # Add all changes
    print("\nAdding all changes...")
    subprocess.run(
        ['git', 'add', '-A'],
        cwd=repo_root,
        check=True
    )
    
    # Commit with detailed message
    commit_message = """feat: Implement WCAG 2.1 Level AA accessibility compliance

- Add semantic HTML structure (header, main, nav, footer landmarks)
- Implement skip navigation link for keyboard users
- Add comprehensive ARIA labels and roles to all interactive elements
- Enhance color contrast ratios to meet AA standards (4.5:1)
- Improve focus indicators with 3:1 contrast minimum
- Make all charts and data visualizations keyboard accessible
- Add screen reader support with live regions for dynamic content
- Ensure all tables have sortable headers with keyboard support
- Add descriptive labels to all form controls and buttons
- Remove auto-opening dialog behavior
- Update viewport meta to allow user scaling up to 500%
- Add ARIA descriptions to all social media links
- Implement proper heading hierarchy throughout application

Changes affect 15+ files including:
- App.tsx, Index.tsx, Admin.tsx
- Navbar.tsx, Footer.tsx
- RevenueCard.tsx, ExpenditureCard.tsx, BudgetProgressGauge.tsx
- RevenueChart.tsx, ExpenditureChart.tsx
- RevenueTable.tsx, ExpenditureTable.tsx
- index.html, index.css

These improvements ensure equal access for users with disabilities
and meet government website accessibility requirements."""
    
    print(f"\nCommitting changes...")
    subprocess.run(
        ['git', 'commit', '-m', commit_message],
        cwd=repo_root,
        check=True
    )
    
    # Push to remote
    print(f"\nPushing to origin/{current_branch}...")
    result = subprocess.run(
        ['git', 'push', 'origin', current_branch],
        cwd=repo_root,
        capture_output=True,
        text=True,
        check=True
    )
    
    print(f"\n✓ Successfully committed and pushed to {current_branch}")
    print(f"\nPush output:\n{result.stdout}")
    if result.stderr:
        print(f"Push stderr:\n{result.stderr}")
    
except subprocess.CalledProcessError as e:
    print(f"\nERROR: Git command failed")
    print(f"Command: {' '.join(e.cmd)}")
    print(f"Return code: {e.returncode}")
    if e.stdout:
        print(f"stdout: {e.stdout}")
    if e.stderr:
        print(f"stderr: {e.stderr}")
    exit(1)
except Exception as e:
    print(f"\nERROR: {type(e).__name__}: {e}")
    exit(1)

print("\n=== Done ===")
